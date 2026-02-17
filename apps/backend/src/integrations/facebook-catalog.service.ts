import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ChannelOffersService } from '../products/channel-offers.service';
import { OrderSource } from '@prisma/client';

@Injectable()
export class FacebookCatalogService {
    private readonly logger = new Logger(FacebookCatalogService.name);

    constructor(
        private prisma: PrismaService,
        private channelOffersService: ChannelOffersService,
    ) { }

    async generateXmlFeed(tenantId: string): Promise<string> {
        try {
            const tenant = await this.prisma.tenant.findUnique({
                where: { id: tenantId },
            });

            if (!tenant) {
                throw new Error('Tenant not found');
            }

            const offers = await this.channelOffersService.findAll(tenantId, OrderSource.FACEBOOK) as any[];
            const activeOffers = offers.filter((o) => o.isActive);

            const baseUrl = tenant.primaryDomain
                ? `https://${tenant.primaryDomain}`
                : `https://${tenant.slug}.artifact.cl`;

            let xml = `<?xml version="1.0"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>${this.escapeXml(tenant.name)} Catalog</title>
    <link>${baseUrl}</link>
    <description>Product feed for Facebook Marketplace from Artifact ERP</description>
    <generator>Artifact ERP Facebook Integration</generator>`;

            for (const offer of activeOffers) {
                const product = offer.product;
                const price = offer.price || product.price;
                // Fix: price might be Decimal, convert to number or string
                const formattedPrice = `${price.toString()} CLP`;

                // Construct Link - assuming standard storefront path
                const productLink = `${baseUrl}/products/${product.id}`;

                // Handle images - construct absolute URL if relative
                let imageUrl = '';
                if (product.imageUrl) {
                    imageUrl = product.imageUrl.startsWith('http')
                        ? product.imageUrl
                        : `${baseUrl}${product.imageUrl.startsWith('/') ? '' : '/'}${product.imageUrl}`;
                }

                xml += `
    <item>
      <g:id>${product.id}</g:id>
      <g:title><![CDATA[${product.name}]]></g:title>
      <g:description><![CDATA[${product.description || product.name}]]></g:description>
      <g:link>${productLink}</g:link>
      <g:image_link>${imageUrl}</g:image_link>
      <g:condition>new</g:condition>
      <g:availability>in stock</g:availability>
      <g:price>${formattedPrice}</g:price>
      <g:brand>${this.escapeXml(tenant.name)}</g:brand>
      <g:google_product_category>Software > Business &amp; Productivity Software</g:google_product_category>
    </item>`;
            }

            xml += `
  </channel>
</rss>`;

            return xml;
        } catch (error) {
            this.logger.error(`Error generating Facebook feed for tenant ${tenantId}: ${error.message}`);
            throw error;
        }
    }

    private escapeXml(unsafe: string): string {
        return unsafe.replace(/[<>&"']/g, (c) => {
            switch (c) {
                case '<': return '&lt;';
                case '>': return '&gt;';
                case '&': return '&amp;';
                case '"': return '&quot;';
                case "'": return '&apos;';
                default: return c;
            }
        });
    }
}
