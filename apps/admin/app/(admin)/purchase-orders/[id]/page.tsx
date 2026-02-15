import PurchaseOrderEdit from '@/components/purchase-orders/PurchaseOrderEdit';

export default function EditPurchaseOrderPage({ params }: { params: { id: string } }) {
    return <PurchaseOrderEdit id={params.id} />;
}
