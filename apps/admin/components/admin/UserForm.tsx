import React from "react";

interface UserFormProps {
  // Define props for user form, e.g., initialData, onSubmit
}

const UserForm: React.FC<UserFormProps> = () => {
  return (
    <form className="space-y-4 card-premium p-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-[rgb(var(--text-secondary))]">Nombre</label>
        <input
          type="text"
          id="name"
          className="input-primary mt-1 block w-full"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-[rgb(var(--text-secondary))]">Email</label>
        <input
          type="email"
          id="email"
          className="input-primary mt-1 block w-full"
        />
      </div>
      <div>
        <button
          type="submit"
          className="btn-primary"
        >
          Guardar Usuario
        </button>
      </div>
    </form>
  );
};

export default UserForm;
