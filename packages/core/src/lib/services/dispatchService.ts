import fetchWithAuth from '../fetchWithAuth'
import { Dispatch, CreateDispatchDto, UpdateDispatchDto, PaginatedResponse } from '../types'

export const DispatchService = {
    async getAllDispatches(
        page: number = 1,
        limit: number = 10,
        orderId?: string
    ): Promise<PaginatedResponse<Dispatch>> {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
        })
        if (orderId) {
            params.append('orderId', orderId)
        }
        const data = await fetchWithAuth(`/dispatches?${params.toString()}`)
        return {
            data: data.data,
            total: data.total,
            page: data.currentPage,
            limit: limit,
            pages: data.pages,
        }
    },

    async getDispatchById(id: string): Promise<Dispatch> {
        return fetchWithAuth(`/dispatches/${id}`)
    },

    async createDispatch(dispatchData: CreateDispatchDto): Promise<Dispatch> {
        return fetchWithAuth(`/dispatches`, {
            method: 'POST',
            body: JSON.stringify(dispatchData),
        })
    },

    async updateDispatch(id: string, dispatchData: UpdateDispatchDto): Promise<Dispatch> {
        return fetchWithAuth(`/dispatches/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(dispatchData),
        })
    },

    async getDispatchLabel(id: string): Promise<string> {
        const res = await fetchWithAuth(`/dispatches/${id}/label`)
        return res
    },
}
