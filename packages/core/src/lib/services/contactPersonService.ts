import fetchWithAuth from '../fetchWithAuth'
import {
  ContactPerson,
  CreateContactPersonDto,
  UpdateContactPersonDto,
  PaginatedResponse,
} from '../types'

export const ContactPersonService = {
  async getAllContactPeople(
    companyId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<ContactPerson>> {
    return fetchWithAuth(
      `/companies/${companyId}/contact-people?page=${page}&limit=${limit}`
    )
  },

  async getContactPersonById(
    companyId: string,
    id: string
  ): Promise<ContactPerson> {
    return fetchWithAuth(`/companies/${companyId}/contact-people/${id}`)
  },

  async createContactPerson(
    companyId: string,
    contactPersonData: CreateContactPersonDto
  ): Promise<ContactPerson> {
    return fetchWithAuth(`/companies/${companyId}/contact-people`, {
      method: 'POST',
      body: JSON.stringify(contactPersonData),
    })
  },

  async updateContactPerson(
    companyId: string,
    id: string,
    contactPersonData: UpdateContactPersonDto
  ): Promise<ContactPerson> {
    return fetchWithAuth(`/companies/${companyId}/contact-people/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(contactPersonData),
    })
  },

  async deleteContactPerson(companyId: string, id: string): Promise<void> {
    await fetchWithAuth(`/companies/${companyId}/contact-people/${id}`, {
      method: 'DELETE',
    })
  },
}
