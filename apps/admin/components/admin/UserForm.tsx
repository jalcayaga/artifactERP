import React from "react";

interface UserFormProps {
  // Define props for user form, e.g., initialData, onSubmit
}

const UserForm: React.FC<UserFormProps> = () => {
  return (
    <form className="space-y-4 bg-white p-6 rounded-lg shadow-md">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre</label>
        <input
          type="text"
          id="name"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand focus:ring-brand"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          id="email"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand focus:ring-brand"
        />
      </div>
      <div>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-brand hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand"
        >
          Guardar Usuario
        </button>
      </div>
    </form>
  );
};

export default UserForm;
