// frontend/lib/services/productService.ts
import axios from 'axios';
import { Product, ProductType } from '@/lib/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

interface PaginatedProductsResponse {
  data: Product[];
  total: number;
  pages: number;
  currentPage: number;
}

// START OF JSON PRODUCT DATA
// This data is combined from the three JSON files you provided.
const RAW_PRODUCT_DATA_JSON = [
  {"Nombre del Producto":"Cámara IP domo IP67 2MP IR IPC-HDPW1230R1-S5","URL del Producto":"https://www.iai-tech.cl/product/camara-ip-domo-ip67-2mp-ir-ipc-hdpw1230r1-s5","Precio (CLP)":"55246","Imagen del Producto":"[\"https://dojiw2m9tvv09.cloudfront.net/102107/product/S_4d20027bccd8478cb0c6b799fb1d05b4311.png?50&time=1746676542\"]"},
  {"Nombre del Producto":"Cámara PT IP full color e IR de 2 MP SD3A200-GN-A-PV","URL del Producto":"https://www.iai-tech.cl/product/camara-pt-ip-full-color-e-ir-de-2-mp-sd3a200-gn-a-pv","Precio (CLP)":"115656","Imagen del Producto":"[\"https://dojiw2m9tvv09.cloudfront.net/102107/product/S_76273371dfbefa8ac9fbdcdef8a5d1d6563.png?50&time=1746676542\"]"},
  {"Nombre del Producto":"Compra Dahua Technology Dahua IPC-HFW5541E-ZE Serie Wizmind, IP67 5MP 2,7-13,5mm Lente varifocal","URL del Producto":"https://www.iai-tech.cl/product/compra-dahua-technology-dahua-ipc-hfw5541e-ze-serie-wizmind-ip67-5mp-2-7-13-5mm-lente-varifocal","Precio (CLP)":"301401","Imagen del Producto":"[\"https://dojiw2m9tvv09.cloudfront.net/102107/product/S_5b3186267b05fb8bd668a551ecd30416419.png?50&time=1746676542\"]"},
  {"Nombre del Producto":"DAHUA BALA 2MP 1080P 2.8mm IR20MT PLASTICA FULL COLOR DH-HAC-HFW1209CN-LED-0280B-S2","URL del Producto":"https://www.iai-tech.cl/product/dahua-bala-2mp-1080p-2-8mm-ir20mt-plastica-full-color-dh-hac-hfw1209cn-led-0280b-s2","Precio (CLP)":"23886","Imagen del Producto":"[\"https://dojiw2m9tvv09.cloudfront.net/102107/product/S_0734d3e06c5baaf4664f766607cebea4173.png?50&time=1746676542\"]"},
  {"Nombre del Producto":"DAHUA CAMARA DH-HAC-B2A21N BALA HDCVI 2MP 20 MTS IR 2.8MM IP67 METALICA","URL del Producto":"https://www.iai-tech.cl/product/dahua-camara-dh-hac-b2a21n-bala-hdcvi-2mp-20-mts-ir-2-8mm-ip67-metalica","Precio (CLP)":"19810","Imagen del Producto":"[\"https://dojiw2m9tvv09.cloudfront.net/102107/product/S_bala-dahua-metalica2898.png?50&time=1746676542\"]"},
  {"Nombre del Producto":"DAHUA DHI-NVR4108HS-8P-4KS3 NVR 8 POE WINSENSE","URL del Producto":"https://www.iai-tech.cl/product/dahua-dhi-nvr4108hs-8p-4ks3-nvr-8-poe-winsense","Precio (CLP)":"189091","Imagen del Producto":"[\"https://dojiw2m9tvv09.cloudfront.net/102107/product/S_a7a1f7a87d202cb3f835a54f7c0d6846714.png?50&time=1746676542\"]"},
  {"Nombre del Producto":"Dahua DHI-VTH5221DW MONITOR WIFI VIDEO,PORTERO 7''(1024*600),MIC SD 8G ,Color Blanco,12V,PoE.","URL del Producto":"https://www.iai-tech.cl/product/dahua-dhi-vth5221dw-monitor-wifi-video-portero-7-1024-600-mic-sd-8g-color-blanco-12v-poe","Precio (CLP)":"131984","Imagen del Producto":"[\"https://dojiw2m9tvv09.cloudfront.net/102107/product/S_52eed8cd34daf765f75d2a39a0a31413036.png?50&time=1746676542\"]"},
  {"Nombre del Producto":"DAHUA HDCVI PTZ 2MP,25X,ALARMA 2-1,1-AUDIO,360","URL del Producto":"https://www.iai-tech.cl/product/dahua-hdcvi-ptz-2mp-25x-alarma-2-1-1-audio-360","Precio (CLP)":"248499","Imagen del Producto":"[\"https://dojiw2m9tvv09.cloudfront.net/102107/product/S_db520d2c2e58acc77e9a02ec4173fdc3812.png?50&time=1746676542\"]"},
  {"Nombre del Producto":"DAHUA XVR5104HS-X1 4 Canales Pentahibrido 4 MPLite 1080p 720p H265+2 Ch IP","URL del Producto":"https://www.iai-tech.cl/product/dahua-xvr5104hs-x1-4-canales-pentahibrido-4-mplite-1080p-720p-h265-2-ch-ip","Precio (CLP)":"69790","Imagen del Producto":"[\"https://dojiw2m9tvv09.cloudfront.net/102107/product/S_764285857762500d7570554023051967776.png?50&time=1746676542\"]"},
  {"Nombre del Producto":"DH-HAC-B1A21N-028B. Camara Dahua HDCVI Bala 2MP 1080P 2.8mm IR20 IP67","URL del Producto":"https://www.iai-tech.cl/product/dh-hac-b1a21n-028b-camara-dahua-hdcvi-bala-2mp-1080p-2-8mm-ir20-ip67","Precio (CLP)":"18584","Imagen del Producto":"[\"https://dojiw2m9tvv09.cloudfront.net/102107/product/S_bala-dahua-2mp-17692.png?50&time=1746676542\"]"},
  {"Nombre del Producto":"DH-HAC-HDW1200TLMN-0280B-S6. Camara Dahua HDCVI tipo eyeball 2MP IR20m fijo 2.8mm","URL del Producto":"https://www.iai-tech.cl/product/dh-hac-hdw1200tlmn-0280b-s6-camara-dahua-hdcvi-tipo-eyeball-2mp-ir20m-fijo-2-8mm","Precio (CLP)":"26686","Imagen del Producto":"[\"https://dojiw2m9tvv09.cloudfront.net/102107/product/S_6bdbd353c19350ec790f09f7399b7407450.png?50&time=1746676542\"]"},
  {"Nombre del Producto":"DH-HAC-HDW1200TLMN-IL-A-0280B-S6. Camara Dahua HDCVI tipo eyeball 2MP Iluminación 20m lente fijo 2","URL del Producto":"https://www.iai-tech.cl/product/dh-hac-hdw1200tlmn-il-a-0280b-s6-camara-dahua-hdcvi-tipo-eyeball-2mp-iluminacion-20m-lente-fijo-2","Precio (CLP)":"26424","Imagen del Producto":"[\"https://dojiw2m9tvv09.cloudfront.net/102107/product/S_domo-dahua-full-color-audio-18361.png?50&time=1746676542\"]"},
  {"Nombre del Producto":"DH-HAC-HDW1209TLQN-A-LED-0280B. Camara Full Color 2mp Starlight con audio IP67 LED 20m","URL del Producto":"https://www.iai-tech.cl/product/dh-hac-hdw1209tlqn-a-led-0280b-camara-full-color-2mp-starlight-con-audio-ip67-led-20m","Precio (CLP)":"30430","Imagen del Producto":"[\"https://dojiw2m9tvv09.cloudfront.net/102107/product/S_domo-dahua-full-color-audio-15149.png?50&time=1746676542\"]"},
  {"Nombre del Producto":"DH-HAC-HDW1801TN-A-0360B-S2. Cámara HDCVI Eyeball 8MP audio incorporado lente fijo 3.6mm IR60m IP67","URL del Producto":"https://www.iai-tech.cl/product/dh-hac-hdw1801tn-a-0360b-s2-camara-hdcvi-eyeball-8mp-audio-incorporado-lente-fijo-3-6mm-ir60m-ip67","Precio (CLP)":"32111","Imagen del Producto":"[\"https://dojiw2m9tvv09.cloudfront.net/102107/product/S_domo-dahua-4k-mic-10681.png?50&time=1746676542\"]"},
  {"Nombre del Producto":"DH-HAC-HDW3200LN-0210B. MINI DOMO MóVIL DAHUA HDCVI. 2MP. LF 2.1MM. IR3M. CONECTOR M12 IP67 MIC. 12","URL del Producto":"https://www.iai-tech.cl/product/dh-hac-hdw3200ln-0210b-mini-domo-movil-dahua-hdcvi-2mp-lf-2-1mm-ir3m-conector-m12-ip67-mic-12","Precio (CLP)":"21175","Imagen del Producto":"[\"https://dojiw2m9tvv09.cloudfront.net/102107/product/S_domo-dahua-mini-movil-18953.png?50&time=1746676542\"]"},
  {"Nombre del Producto":"DH-HAC-HFW1209CLN-LED-0280B-S2. Camara HDCVI bullet 2MP Full Color IP67 iluminación de 20m","URL del Producto":"https://www.iai-tech.cl/product/dh-hac-hfw1209cln-led-0280b-s2-camara-hdcvi-bullet-2mp-full-color-ip67-iluminacion-de-20m","Precio (CLP)":"24080","Imagen del Producto":"[\"https://dojiw2m9tvv09.cloudfront.net/102107/product/S_bala-dahua-full-color-19989.png?50&time=1746676542\"]"},
  {"Nombre del Producto":"DH-HAC-HFW1239CN-A-LED-0280B-S2. Cámara HDCVI bullet 2MP lente fijo 2.8mm full color microfono","URL del Producto":"https://www.iai-tech.cl/product/dh-hac-hfw1239cn-a-led-0280b-s2-camara-hdcvi-bullet-2mp-lente-fijo-2-8mm-full-color-microfono","Precio (CLP)":"33231","Imagen del Producto":"[\"https://dojiw2m9tvv09.cloudfront.net/102107/product/S_bala-dahua-full-color-audio-20035.png?50&time=1746676543\"]"},
  {"Nombre del Producto":"DH-HAC-HFW1239TLMN-IL-A 2.8MM 2MP 2.8MM METALICA ILUMINAR DUAL LIGHT AUDIO 40MT IP67","URL del Producto":"https://www.iai-tech.cl/product/dh-hac-hfw1239tlmn-il-a-2-8mm-2mp-2-8mm-metalica-iluminar-dual-light-audio-40mt-ip67","Precio (CLP)":"42175","Imagen del Producto":"[\"https://dojiw2m9tvv09.cloudfront.net/102107/product/S_be73aafe3fcbae5c911fc7ea43a0f272412.png?50&time=1746676543\"]"},
  {"Nombre del Producto":"DH-HAC-HFW1500CMN-IL-A-0280B-S2 Cámara HDCVI bullet Dahua 5MP lente fijo 2.8mm doble iluminacion","URL del Producto":"https://www.iai-tech.cl/product/dh-hac-hfw1500cmn-il-a-0280b-s2-camara-hdcvi-bullet-dahua-5mp-lente-fijo-2-8mm-doble-iluminacion","Precio (CLP)":"39900","Imagen del Producto":"[\"https://dojiw2m9tvv09.cloudfront.net/102107/product/S_bala-dahua-full-color-audio-24314.png?50&time=1746676543\"]"},
  {"Nombre del Producto":"DH-HAC-HFW1500RN-Z-IRE6-A. Cámara HDCVI Dahua tipo bullet 5MP lente varifocal IR 60Mt microfono inc","URL del Producto":"https://www.iai-tech.cl/product/dh-hac-hfw1500rn-z-ire6-a-camara-hdcvi-dahua-tipo-bullet-5mp-lente-varifocal-ir-60mt-microfono-inc","Precio (CLP)":"70874","Imagen del Producto":"[\"https://dojiw2m9tvv09.cloudfront.net/102107/product/S_bala-dahua-vf-19677.png?50&time=1746676543\"]"},
  {"Nombre del Producto":"DH-HAC-HFW1800TLN-A-0600B. Camara HDCVI bullet 8MP lente fijo 6mm IR 80m proteccion IP67","URL del Producto":"https://www.iai-tech.cl/product/dh-hac-hfw1800tln-a-0600b-camara-hdcvi-bullet-8mp-lente-fijo-6mm-ir-80m-proteccion-ip67","Precio (CLP)":"32374","Imagen del Producto":"[\"https://dojiw2m9tvv09.cloudfront.net/102107/product/S_bala-dahua-8mp6464.png?50&time=1746676543\"]"},
  {"Nombre del Producto":"DH-HAC-PT1509AN-A-LED-0280B-S2. Cámara Dahua PT HDCVI 5 mp lente fijo 2.8mm Iluminacion 40m Mic","URL del Producto":"https://www.iai-tech.cl/product/dh-hac-pt1509an-a-led-0280b-s2-camara-dahua-pt-hdcvi-5-mp-lente-fijo-2-8mm-iluminacion-40m-mic","Precio (CLP)":"63786","Imagen del Producto":"[\"https://dojiw2m9tvv09.cloudfront.net/102107/product/S_domo-pt-dahua-full-color4544.png?50&time=1746676543\"]"},
  {"Nombre del Producto":"DH-HAC-T1A21N-0280B Cámara Dahua HDCVI Domo 2MP 1080P 2.8mm IR20 Plástica.","URL del Producto":"https://www.iai-tech.cl/product/dh-hac-t1a21n-0280b-camara-dahua-hdcvi-domo-2mp-1080p-2-8mm-ir20-plastica","Precio (CLP)":"18107","Imagen del Producto":"[\"https://dojiw2m9tvv09.cloudfront.net/102107/product/S_domo-dahua-2mp-13420.png?50&time=1746676543\"]"},
  {"Nombre del Producto":"DH-IPC-EB5541N-AS. FISH EYE 360 IP DAHUA. 5MP. WIS MIND. IP67. IK10. AUDIO","URL del Producto":"https://www.iai-tech.cl/product/dh-ipc-eb5541n-as-fish-eye-360-ip-dahua-5mp-wis-mind-ip67-ik10-audio","Precio (CLP)":"198974","Imagen del Producto":"[\"https://dojiw2m9tvv09.cloudfront.net/102107/product/S_domo-dahua-fisheye-15518.png?50&time=1746676543\"]"},
  {"Nombre del Producto":"DH-IPC-F2CN-LED-0280B. Bala IP WIFI Dahua. 2MP Full Color. Dual Light. 30Mts. LF 2.8mm. IP67. Audio","URL del Producto":"https://www.iai-tech.cl/product/dh-ipc-f2cn-led-0280b-bala-ip-wifi-dahua-2mp-full-color-dual-light-30mts-lf-2-8mm-ip67-audio","Precio (CLP)":"55649","Imagen del Producto":"[\"https://dojiw2m9tvv09.cloudfront.net/102107/product/S_bala-dahua-ip-wifi-14283.png?50&time=1746676930\"]"},
  {"Nombre del Producto":"DH-IPC-HDW1239VP-A-IL-0280B. Minidomo Ip 2MP Dahua Iluminacion Dual Lente 2.8mm IR30m 12v POE IP67","URL del Producto":"https://www.iai-tech.cl/product/dh-ipc-hdw1239vp-a-il-0280b-minidomo-ip-2mp-dahua-iluminacion-dual-lente-2-8mm-ir30m-12v-poe-ip67","Precio (CLP)":"54231","Imagen del Producto":"[\"https://dojiw2m9tvv09.cloudfront.net/102107/product/S_domo-dahua-ip-dual-light-15771.png?50&time=1746676930\"]"},
  {"Nombre del Producto":"DH-IPC-HDW2249S-S-IL-0280B. Cámara IP Eyeball 2MP lente fijo 2.8mm dual iluminacion 30M IP67 SMD P","URL del Producto":"https://www.iai-tech.cl/product/dh-ipc-hdw2249s-s-il-0280b-camara-ip-eyeball-2mp-lente-fijo-2-8mm-dual-iluminacion-30m-ip67-smd-p","Precio (CLP)":"71049","Imagen del Producto":"[\"https://dojiw2m9tvv09.cloudfront.net/102107/product/S_domo-dahua-ip-dual-light-2mp-17069.png?50&time=1746676930\"]"},
  {"Nombre del Producto":"DH-IPC-HFW1230S1N-S5 CAMARA BALA IP POE 2MP 2.8MM IR30MT METAL+PLASTICA IP67","URL del Producto":"https://www.iai-tech.cl/product/dh-ipc-hfw1230s1n-s5-camara-bala-ip-poe-2mp-2-8mm-ir30mt-metal-plastica-ip67","Precio (CLP)":"47074","Imagen del Producto":"[\"https://dojiw2m9tvv09.cloudfront.net/102107/product/S_bala-dahua-ip-2mp-16483.png?50&time=1746676930\"]"},
  {"Nombre del Producto":"DH-IPC-P3BP-PV-0360B. Cámara IP Dahua Wifi 3MP lente fijo 3.6mm con Pan y Til de exterior (IP66).","URL del Producto":"https://www.iai-tech.cl/product/dh-ipc-p3bp-pv-0360b-camara-ip-dahua-wifi-3mp-lente-fijo-3-6mm-con-pan-y-til-de-exterior-ip66","Precio (CLP)":"57661","Imagen del Producto":"[\"https://dojiw2m9tvv09.cloudfront.net/102107/product/S_domo-pt-dahua-ip-picoo-11221.png?50&time=1746676930\"]"},
  {"Nombre del Producto":"DH-IPC-P5BP-PV-0360B. Cámara IP Dahua Wifi 5MP lente fijo 3.6mm con Pan y Til de exterior (IP66).","URL del Producto":"https://www.iai-tech.cl/product/dh-ipc-p5bp-pv-0360b-camara-ip-dahua-wifi-5mp-lente-fijo-3-6mm-con-pan-y-til-de-exterior-ip66","Precio (CLP)":"67286","Imagen del Producto":"[\"https://dojiw2m9tvv09.cloudfront.net/102107/product/S_domo-pt-dahua-ip-picoo-17060.png?50&time=1746676930\"]"},
  {"Nombre del Producto":"DH-MEC-S310. CAMARA ANEXA PORTATIL DAHUA MPT. 2MP. IR 5MTS. LF 2.6MM","URL del Producto":"https://www.iai-tech.cl/product/dh-mec-s310-camara-anexa-portatil-dahua-mpt-2mp-ir-5mts-lf-2-6mm","Precio (CLP)":"81865","Imagen del Producto":"[\"https://dojiw2m9tvv09.cloudfront.net/102107/product/S_dahua-portatil-mic-19066.png?50&time=1746676930\"]"},
  {"Nombre del Producto":"DH-N3 ROUTER INALaMBRICO 100Mbps 2.4Ghz 12V-0,5 A DAHUA","URL del Producto":"https://www.iai-tech.cl/product/dh-n3-router-inalambrico-100mbps-2-4ghz-12v-0-5-a-dahua","Precio (CLP)":"13125","Imagen del Producto":"[\"https://dojiw2m9tvv09.cloudfront.net/102107/product/S_router-dahua-n3-10124.png?50&time=1746676930\"]"},
  {"Nombre del Producto":"DH-PFA130-E","URL del Producto":"https://www.iai-tech.cl/product/dh-pfa130-e","Precio (CLP)":"11549","Imagen del Producto":"[\"https://dojiw2m9tvv09.cloudfront.net/102107/product/S_d6edc565a35a214f675c9c61b5069a17718.png?50&time=1746676930\"]"},
  {"Nombre del Producto":"DH-PFA134 Caja resistente al agua Dahua IMPERMEABLE SIN COMA 90.0MMx35.0MM ALUMINIO+SECC MAX 1KG","URL del Producto":"https://www.iai-tech.cl/product/dh-pfa134-caja-resistente-al-agua-dahua-impermeable-sin-coma-90-0mmx35-0mm-aluminio-secc-max-1kg","Precio (CLP)":"7175","Imagen del Producto":"[\"https://dojiw2m9tvv09.cloudfront.net/102107/product/S_soporte-camara-dahua-12655.png?50&time=1746676930\"]"},
  {"Nombre del Producto":"DH-PFB203W Soporte Montaje en Pared Aluminio+SECC 160mmx122mmx76 mm MAX 1KG","URL del Producto":"https://www.iai-tech.cl/product/dh-pfb203w-soporte-montaje-en-pared-aluminio-secc-160mmx122mmx76-mm-max-1kg","Precio (CLP)":"10150","Imagen del Producto":"[\"https://dojiw2m9tvv09.cloudfront.net/102107/product/S_soporte-camara-domo-dahua-10275.png?50&time=1746676930\"]"},
  {"Nombre del Producto":"DH-PFB303S. DAHUA Soporte tipo poste para PTZ.","URL del Producto":"https://www.iai-tech.cl/product/dh-pfb303s-dahua-soporte-tipo-poste-para-ptz","Precio (CLP)":"60550","Imagen del Producto":"[\"https://dojiw2m9tvv09.cloudfront.net/102107/product/S_soporte-camara-pt-dahua-14750.png?50&time=1746676930\"]"},
  {"Nombre del Producto":"DH-PFM800-E","URL del Producto":"https://www.iai-tech.cl/product/dh-pfm800-e","Precio (CLP)":"2684","Imagen del Producto":"[\"https://dojiw2m9tvv09.cloudfront.net/102107/product/S_48bfb999ae33df352bd99ce9f091d7a8891.png?50&time=1746676930\"]"},
  {"Nombre del Producto":"DH-PFM800b Channel Passive HDCVI Balun","URL del Producto":"https://www.iai-tech.cl/product/dh-pfm800b-channel-passive-hdcvi-balun","Precio (CLP)":"2047","Imagen del Producto":"[\"https://dojiw2m9tvv09.cloudfront.net/102107/product/S_balun-dahua-12932.png?50&time=1746676930\"]"},
  {"Nombre del Producto":"DH-PFS3226-24ET-240. Switch PoE 24 PUertos DAHUA 240W.","URL del Producto":"https://www.iai-tech.cl/product/dh-pfs3226-24et-240-switch-poe-24-puertos-dahua-240w","Precio (CLP)":"206674","Imagen del Producto":"[\"https://dojiw2m9tvv09.cloudfront.net/102107/product/S_switch-poe-dahua-24ch-12585.png?50&time=1746676930\"]"},
  {"Nombre del Producto":"DH-SD4A216DB-HNY. PTZ IP DAHUA. 16X. IP66. IR 100MTS. WIZSENSE. SMD3.0. AUDIO. MICRO SD. ALARM IN-O","URL del Producto":"https://www.iai-tech.cl/product/dh-sd4a216db-hny-ptz-ip-dahua-16x-ip66-ir-100mts-wizsense-smd3-0-audio-micro-sd-alarm-in-o","Precio (CLP)":"306775","Imagen del Producto":"[\"https://dojiw2m9tvv09.cloudfront.net/102107/product/S_ptz-dahua-ip-16x-12367.png?50&time=1746676930\"]"},
  {"Nombre del Producto":"DH-XVR1B04-I. 1080N-720P Tiempo real, H.264 Compresion de Video. 1 HDMI-1 VGA, 4ch Video Entrada","URL del Producto":"https://www.iai-tech.cl/product/dh-xvr1b04-i-1080n-720p-tiempo-real-h-264-compresion-de-video-1-hdmi-1-vga-4ch-video-entrada","Precio (CLP)":"40325","Imagen del Producto":"[\"https://dojiw2m9tvv09.cloudfront.net/102107/product/S_dahua-dvr-hd8997.png?50&time=1746676930\"]"},
  {"Nombre del Producto":"DH-XVR1B08-I. XVR Dahua 720P 8CH HDCVI +2IP 1HDD 1U WizSense","URL del Producto":"https://www.iai-tech.cl/product/dh-xvr1b08-i-xvr-dahua-720p-8ch-hdcvi-2ip-1hdd-1u-wizsense","Precio (CLP)":"55680","Imagen del Producto":"[\"https://dojiw2m9tvv09.cloudfront.net/102107/product/S_dahua-dvr-hd1527.png?50&time=1746676930\"]"},
  {"Nombre del Producto":"DH-XVR5104HE-I3. XVR Dahua de 4 canales hasta 5Mp soporta IA 1HDD I-O alarmas","URL del Producto":"https://www.iai-tech.cl/product/dh-xvr5104he-i3-xvr-dahua-de-4-canales-hasta-5mp-soporta-ia-1hdd-i-o-alarmas","Precio (CLP)":"60899","Imagen del Producto":"[\"https://dojiw2m9tvv09.cloudfront.net/102107/product/S_dahua-dvr-32ch-1080p-lite-15957.png?50&time=1746676930\"]"},
  {"Nombre del Producto":"DH-XVR5108HE-I3. Grabador XVR Dahua 8ch WizSense H265+ 1HDD Alarmas 8in 3out","URL del Producto":"https://www.iai-tech.cl/product/dh-xvr5108he-i3-grabador-xvr-dahua-8ch-wizsense-h265-1hdd-alarmas-8in-3out","Precio (CLP)":"143306","Imagen del Producto":"[\"https://dojiw2m9tvv09.cloudfront.net/102107/product/S_dahua-dvr-32ch-1080p-lite-11339.png?50&time=1746676930\"]"},
  {"Nombre del Producto":"DH-XVR5116HE-I3. XVR DAHUA 16CH. FULL HD GRAB Y VISUALI. ENTR Y SAL DE AUDIO Y ALARMAS.","URL del Producto":"https://www.iai-tech.cl/product/dh-xvr5116he-i3-xvr-dahua-16ch-full-hd-grab-y-visuali-entr-y-sal-de-audio-y-alarmas","Precio (CLP)":"250425","Imagen del Producto":"[\"https://dojiw2m9tvv09.cloudfront.net/102107/product/S_dahua-dvr-32ch-1080p-lite-11384.png?50&time=1746676930\"]"},
  {"Nombre del Producto":"DHI-HY-1022 Panel de control de alarma contra incendios direccionable con impresora","URL del Producto":"https://www.iai-tech.cl/product/dhi-hy-1022-panel-de-control-de-alarma-contra-incendios-direccionable-con-impresora","Precio (CLP)":"536200","Imagen del Producto":"[\"https://dojiw2m9tvv09.cloudfront.net/102107/product/S_63cd6bf93624b16a2dd7615744aa1a71043.png?50&time=1746676930\"]"},
  {"Nombre del Producto":"DHI-HY-C102-4. Panel Dahua de control de alarma contra incendios convencional","URL del Producto":"https://www.iai-tech.cl/product/dhi-hy-c102-4-panel-dahua-de-control-de-alarma-contra-incendios-convencional","Precio (CLP)":"161296","Imagen del Producto":"[\"https://dojiw2m9tvv09.cloudfront.net/102107/product/S_dahua-control-incendio-14046.png?50&time=1746676930\"]"},
  {"Nombre del Producto":"DHI-HY-C121. Pulsador manual Dahua convencional","URL del Producto":"https://www.iai-tech.cl/product/dhi-hy-c121-pulsador-manual-dahua-convencional","Precio (CLP)":"8960","Imagen del Producto":"[\"https://dojiw2m9tvv09.cloudfront.net/102107/product/S_dahua-pulsador-manual8651.png?50&time=1746676930\"]"},
  {"Nombre del Producto":"DHI-HY-C131. Detector de humo Dahua convencional","URL del Producto":"https://www.iai-tech.cl/product/dhi-hy-c131-detector-de-humo-dahua-convencional","Precio (CLP)":"7611","Imagen del Producto":"[\"https://dojiw2m9tvv09.cloudfront.net/102107/product/S_dahua-detector-de-humo-11840.png?50&time=1746676988\"]"},
  {"Nombre del Producto":"DHI-HY-C132. Detector de calor Dahua convencional","URL del Producto":"https://www.iai-tech.cl/product/dhi-hy-c132-detector-de-calor-dahua-convencional","Precio (CLP)":"6264","Imagen del Producto":"[\"https://dojiw2m9tvv09.cloudfront.net/102107/product/S_dahua-detector-de-calor-15629.png?50&time=1746676988\"]"},
  {"Nombre del Producto":"DHI-HY-FT431LDP-TD1F4. Cámara de red Dahua con detección de llamas","URL del Producto":"https://www.iai-tech.cl/product/dhi-hy-ft431ldp-td1f4-camara-de-red-dahua-con-deteccion-de-llamas","Precio (CLP)":"168874","Imagen del Producto":"[\"https://dojiw2m9tvv09.cloudfront.net/102107/product/S_domo-dahua-termica-10327.png?50&time=1746676988\"]"},
  {"Nombre del Producto":"DHI-NVR4216-16P-4KS2 NVR Dahua 16Ch Poe 4K","URL del Producto":"https://www.iai-tech.cl/product/dhi-nvr4216-16p-4ks2-nvr-dahua-16ch-poe-4k","Precio (CLP)":"281136","Imagen del Producto":"[\"https://dojiw2m9tvv09.cloudfront.net/102107/product/S_dahua-nvr-old-look-15477.png?50&time=1746676988\"]"},
  {"Nombre del Producto":"DHI-NVR4232-4KS3. NVR DAHUA 32CH. 2HDD. COMPATIBLE SMD PLUS.","URL del Producto":"https://www.iai-tech.cl/product/dhi-nvr4232-4ks3-nvr-dahua-32ch-2hdd-compatible-smd-plus","Precio (CLP)":"195649","Imagen del Producto":"[\"https://dojiw2m9tvv09.cloudfront.net/102107/product/S_09e373c9c0e790b26b177b937d30e306307.png?50&time=1746676988\"]"},
  {"Nombre del Producto":"DHI-NVR5232-EI. NVR Dahua 32 canales soporta 2 HDD hasta 16TB IA Perimetral protecction ANPR, FD, F","URL del Producto":"https://www.iai-tech.cl/product/dhi-nvr5232-ei-nvr-dahua-32-canales-soporta-2-hdd-hasta-16tb-ia-perimetral-protecction-anpr-fd-f","Precio (CLP)":"366800","Imagen del Producto":"[\"https://dojiw2m9tvv09.cloudfront.net/102107/product/S_6ba1e88310ec12bb970b4394750041e2164.png?50&time=1746676988\"]"},
  {"Nombre del Producto":"DHI-NVR5864-EI Dahua NVR Grabador de Vídeo 64 Canales 2U 8HDD WizSense","URL del Producto":"https://www.iai-tech.cl/product/dhi-nvr5864-ei-dahua-nvr-grabador-de-video-64-canales-2u-8hdd-wizsense","Precio (CLP)":"922600","Imagen del Producto":"[\"https://dojiw2m9tvv09.cloudfront.net/102107/product/S_b6ab4a4e9914ba9111fb8b5bac5ef083551.png?50&time=1746676988\"]"},
  {"Nombre del Producto":"DHI-TF-C100-256GB. Tarjeta de Memoria micro SD DAHUA Clase10 256GB.","URL del Producto":"https://www.iai-tech.cl/product/dhi-tf-c100-256gb-tarjeta-de-memoria-micro-sd-dahua-clase10-256gb","Precio (CLP)":"29750","Imagen del Producto":"[\"https://dojiw2m9tvv09.cloudfront.net/102107/product/S_feda7b66335c683cac605045c4d7a647067.png?50&time=1746676988\"]"},
  {"Nombre del Producto":"DHI-VTH2611L-WP MONITOR 4.3 PUGADA INTERIOR TOUCH WIFI IP POE COLOR:BLANCO DAHUA","URL del Producto":"https://www.iai-tech.cl/product/dhi-vth2611l-wp-monitor-4-3-pugada-interior-touch-wifi-ip-poe-color-blanco-dahua","Precio (CLP)":"61774","Imagen del Producto":"[\"https://dojiw2m9tvv09.cloudfront.net/102107/product/S_cc097134ef62aba96b9745bc601044e2123.png?50&time=1746676988\"]"},
  {"Nombre del Producto":"DHI-VTO2311R-WP TIMBRE EXTERIOR VILLA WIFI POE CON CAMARA 2MP MAX SD 256GB APP CELULAR","URL del Producto":"https://www.iai-tech.cl/product/dhi-vto2311r-wp-timbre-exterior-villa-wifi-poe-con-camara-2mp-max-sd-256gb-app-celular","Precio (CLP)":"112524","Imagen del Producto":"[\"https://dojiw2m9tvv09.cloudfront.net/102107/product/S_dfd0d74fb0df69b3dc8d49175dcd5eb1757.png?50&time=1746676988\"]"},
  {"Nombre del Producto":"DS-2CD1027G2H-LIU IP BULLET 2MP ColorVu Smart Dual Light 30m Audio PoE 2.8mm Hikvision","URL del Producto":"https://www.iai-tech.cl/product/ds-2cd1027g2h-liu-ip-bullet-2mp-colorvu-smart-dual-light-30m-audio-poe-2-8mm-hikvision","Precio (CLP)":"49874","Imagen del Producto":"[\"https://dojiw2m9tvv09.cloudfront.net/102107/product/S_bbdb00a305dd8b9b2cea6b9eb2321d34183.png?50&time=1746676988\"]"},
  {"Nombre del Producto":"Gabinete de Conexiones DHI-HY-JX40 Dahua","URL del Producto":"https://www.iai-tech.cl/product/gabinete-de-conexiones-dhi-hy-jx40-dahua","Precio (CLP)":"41386","Imagen del Producto":"[\"https://dojiw2m9tvv09.cloudfront.net/102107/product/S_23cf9d1f6dd108b4f97a5d148bf614c7404.png?50&time=1746676988\"]"},
  {"Nombre del Producto":"IPC-HDBW2441R-ZS CAMARA DAHUA DOMO 4MP IR 40M IP67 IK10","URL del Producto":"https://www.iai-tech.cl/product/ipc-hdbw2441r-zs-camara-dahua-domo-4mp-ir-40m-ip67-ik10","Precio (CLP)":"155050","Imagen del Producto":"[\"https://dojiw2m9tvv09.cloudfront.net/102107/product/S_3e2554c1817e22f8d38a156422f54fc4511.png?50&time=1746676988\"]"},
  {"Nombre del Producto":"PFB712W. Brazo Dahua montaje a muro color blanco.","URL del Producto":"https://www.iai-tech.cl/product/pfb712w-brazo-dahua-montaje-a-muro-color-blanco","Precio (CLP)":"57596","Imagen del Producto":"[\"https://dojiw2m9tvv09.cloudfront.net/102107/product/S_4e226d2b3d7499275a1455854bc21f05316.png?50&time=1746676988\"]"},
  {"Nombre del Producto":"SWITCH DAHUA 24 GE POE 2 PUERTOS GE + 2 PUERTOS GE SFP 56 Gbps 41 DH-S4228-24GT-240","URL del Producto":"https://www.iai-tech.cl/product/switch-dahua-24-ge-poe-2-puertos-ge-2-puertos-ge-sfp-56-gbps-41-dh-s4228-24gt-240","Precio (CLP)":"373449","Imagen del Producto":"[\"https://dojiw2m9tvv09.cloudfront.net/102107/product/S_c51d2a9b9042ae522ad56e3bf7a4f511501.png?50&time=1746676988\"]"},
  {"Nombre del Producto":"VIDEO BALUN POR PAR 4K Compatible: HDCVI-TVI-AHD-CVBS por CAT5E-6 BOTON","URL del Producto":"https://www.iai-tech.cl/product/video-balun-por-par-4k-compatible-hdcvi-tvi-ahd-cvbs-por-cat5e-6-boton","Precio (CLP)":"3570","Imagen del Producto":"[\"https://dojiw2m9tvv09.cloudfront.net/102107/product/S_balun-dahua-18691.png?50&time=1746676988\"]"},
  {"Nombre del Producto":"XVR 16ch DH-XVR5216AN-4KL-I3 Dahua híbrido 2hdd","URL del Producto":"https://www.iai-tech.cl/product/xvr-16ch-dh-xvr5216an-4kl-i3-dahua-hibrido-2hdd","Precio (CLP)":"421749","Imagen del Producto":"[\"https://dojiw2m9tvv09.cloudfront.net/102107/product/S_30a6b97a93e0e2856a5160c5aac935e5552.png?50&time=1746676988\"]"}
];
// END OF JSON PRODUCT DATA


const deriveCategoryFromName = (name: string): string => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('cámara') || lowerName.includes('camara')) return 'Cámaras';
  if (lowerName.includes('alarma') || lowerName.includes('detector') || lowerName.includes('panel de control') || lowerName.includes('pulsador')) return 'Alarmas';
  if (lowerName.includes('nvr') || lowerName.includes('xvr') || lowerName.includes('grabador')) return 'Grabación';
  if (lowerName.includes('switch') || lowerName.includes('router')) return 'Redes';
  if (lowerName.includes('cable') || lowerName.includes('balun') || lowerName.includes('soporte') || lowerName.includes('gabinete') || lowerName.includes('tarjeta de memoria') || lowerName.includes('pila') || lowerName.includes('monitor') || lowerName.includes('timbre') || lowerName.includes('video portero')) return 'Accesorios';
  return 'Seguridad Electrónica'; // Default category
};

const mapRawProductToAppProduct = (rawProduct: any): Product | null => {
  const productName = rawProduct["Nombre del Producto"];
  const productUrl = rawProduct["URL del Producto"];
  const productPrice = rawProduct["Precio (CLP)"];

  if (!productUrl || !productName || productPrice === undefined || productPrice === null) {
    console.warn("Skipping raw product due to missing essential fields (URL, Name, or Price):", rawProduct);
    return null;
  }

  let images: string[] = [];
  const imageJsonString = rawProduct["Imagen del Producto"];
  if (imageJsonString && typeof imageJsonString === 'string') {
    try {
      const parsedImages = JSON.parse(imageJsonString);
      if (Array.isArray(parsedImages) && parsedImages.length > 0 && typeof parsedImages[0] === 'string') {
        // Filter out any non-string or non-https URLs, just in case
        images = parsedImages.filter(imgUrl => typeof imgUrl === 'string' && imgUrl.startsWith('https://'));
      }
    } catch (e) {
      // console.warn(`Failed to parse images for product ${productName}: ${imageJsonString}`);
      // Keep images as empty array if parsing fails
    }
  }

  const priceValue = parseFloat(String(productPrice).replace(/[^0-9.-]+/g,""));

  return {
    id: String(productUrl),
    name: String(productName),
    price: isNaN(priceValue) ? 0 : priceValue,
    images: images.length > 0 ? images : null,
    productType: 'Producto' as ProductType, // Assuming all are physical products for now
    isPublished: true, // Assuming all listed products are published
    category: deriveCategoryFromName(String(productName)),
    sku: rawProduct["SKU"] ? String(rawProduct["SKU"]) : undefined,
    description: rawProduct["Descripción Corta"] ? String(rawProduct["Descripción Corta"]) : undefined,
    longDescription: rawProduct["Descripción Larga"] ? String(rawProduct["Descripción Larga"]) : undefined,
    unitPrice: rawProduct["Precio Unitario"] ? parseFloat(String(rawProduct["Precio Unitario"]).replace(/[^0-9.-]+/g,"")) : undefined,
    currentStock: rawProduct["Stock Actual"] ? parseInt(String(rawProduct["Stock Actual"]), 10) : undefined,
    reorderLevel: rawProduct["Nivel de Reorden"] ? parseInt(String(rawProduct["Nivel de Reorden"]), 10) : undefined,
  };
};

const ALL_PRODUCTS_MAPPED: (Product | null)[] = RAW_PRODUCT_DATA_JSON.map(mapRawProductToAppProduct);
const ALL_PRODUCTS: Product[] = ALL_PRODUCTS_MAPPED.filter(p => p !== null) as Product[];


const getPublishedProducts = async (
  page: number = 1,
  limit: number = 10,
  category?: string
): Promise<PaginatedProductsResponse> => {
  let filteredProducts = ALL_PRODUCTS;

  if (category) {
    filteredProducts = ALL_PRODUCTS.filter(p => p.category?.toLowerCase() === category.toLowerCase());
  }
  
  const total = filteredProducts.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedData = filteredProducts.slice(startIndex, endIndex);

  return Promise.resolve({
    data: paginatedData,
    total,
    pages: totalPages,
    currentPage: page,
  });
};

const getPublishedProductById = async (productId: string): Promise<Product | null> => {
  const product = ALL_PRODUCTS.find(p => p.id === productId);
  if (product) {
    return Promise.resolve(product);
  }
  console.warn(`Product with ID (URL) ${productId} not found in local data.`);
  return Promise.resolve(null);
};

export const ProductService = {
  getPublishedProducts,
  getPublishedProductById,
};