import fetchWithAuth from '../fetchWithAuth'
import {
  Company,
  CreateCompanyDto,
  UpdateCompanyDto,
  PaginatedResponse,
  CompanyFilterOptions,
} from '../types'

export const CompanyService = {
  async getAllCompanies(
    page: number = 1,
    limit: number = 10,
    filters?: CompanyFilterOptions
  ): Promise<PaginatedResponse<Company>> {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })

    if (filters) {
      if (filters.isClient) {
        queryParams.append('isClient', 'true')
      }
      if (filters.isSupplier) {
        queryParams.append('isSupplier', 'true')
      }
      if (filters.companyOwnership) {
        queryParams.append('companyOwnership', filters.companyOwnership)
      }
    }

    return fetchWithAuth(`/companies?${queryParams.toString()}`)
  },

  async getCompanyById(id: string): Promise<Company> {
    return fetchWithAuth(`/companies/${id}`)
  },

  async createCompany(companyData: CreateCompanyDto): Promise<Company> {
    const response = await fetchWithAuth(`/companies`, {
      method: 'POST',
      body: JSON.stringify(companyData),
    })
    return response // Ensure the full company object is returned
  },

  async updateCompany(
    id: string,
    companyData: UpdateCompanyDto
  ): Promise<Company> {
    const response = await fetchWithAuth(`/companies/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(companyData),
    })
    return response // Ensure the full company object is returned
  },

  async deleteCompany(id: string): Promise<void> {
    await fetchWithAuth(`/companies/${id}`, {
      method: 'DELETE',
    })
  },
}