# Votting App

## Table of Contents
- [Introduction](#introduction)
- [Setup Project](#setup-project)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Running the Project](#running-the-project)
- [Project Structure](#project-structure)
- [Supabase Setup](#supabase-setup)
  - [Create a Supabase Project](#create-a-supabase-project)
  - [Configure Database Tables](#configure-database-tables)
  - [Get API Keys](#get-api-keys)
- [Components](#components)
  - [Navbar](#navbar)
  - [LoginForm](#loginform)
  - [RegisterForm](#registerform)
  - [Layout](#layout)
- [Authentication](#authentication)
- [Configuration](#configuration)
- [Improving the Project](#improving-the-project)
- [Contributing](#contributing)
- [License](#license)

## Introduction
Voting App is a web-based application that allows users to participate in voting. The application is built using Next.js with Tailwind CSS for styling. This project also uses Supabase as the backend for authentication and data storage.

## Setup Project

### Prerequisites
- Node.js (>= 14.x)
- npm or yarn
- Supabase account

### Installation
1. Clone the repository:
    ```sh
    git clone https://github.com/arifsuz/votting-app.git
    cd votting-app
    ```

2. Install dependencies:
    ```sh
    npm install
    # or
    yarn install
    ```

3. Setup environment variables:
    Create a `.env.local` file in the root of the project and add the following environment variables:
    ```sh
    NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
    ```

## Running the Project
To run the project, use the following command:
```sh
npm run dev
# or
yarn dev
```
The application will run on `http://localhost:3000`.

## Project Structure
Here is the overall structure of the project:
```
voting-app/
├── components/
│   ├── AdminDashboard.js
│   ├── AdminLoginForm.js
│   ├── Navbar.js
│   ├── Footer.js
│   └── UserLoginForm.js
│   └── UserVotingPage.js
├── pages/
│   ├── admin/
│   │   ├── dashboard.js
│   │   ├── login.js
│   ├── user/
│   │   ├── index.js
│   │   ├── login.js
│   │   └── vote.js
│   ├── _app.js
│   ├── index.js
│   └── thank-you.js
├── public/
│   └── (your_assets)
├── styles/
│   ├── globals.css
│   └── tailwind.css
├── utils/
│   ├── auth.js
│   └── supabase.js
├── .env.example
├── next.config.js
├── package.json
└── README.md
├── tailwind.config.js
```

## Supabase Setup

### Create a Supabase Project
1. Go to [Supabase](https://supabase.io/) and sign up for an account.
2. Create a new project by clicking on "New Project".
3. Fill in the project details and click "Create new project".

### Configure Database Tables
1. Go to the "Table Editor" in the Supabase dashboard.
2. Create a new table named `admin_users` with the following columns:
    - `id`: Primary key, Integer, Auto-increment
    - `email`: Text
    - `password`: Text

### Get API Keys
1. Go to the "Settings" page in your Supabase project dashboard.
2. Under the "API" section, you will find your `Project URL` and `anon` key.
3. Copy these values and add them to your `.env.local` file:
    ```sh
    NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
    ```

## Components

### Navbar
The `Navbar` component is responsible for the main navigation.
#### File: `components/Navbar.js`
```javascript
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import supabase from '../utils/supabase'; // Pastikan Anda telah mengimpor supabase

export default function Navbar() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const admin = JSON.parse(localStorage.getItem('admin'));
    const user = JSON.parse(localStorage.getItem('user'));
    if (admin) {
      setIsLoggedIn(true);
      setIsAdmin(true);
    } else if (user) {
      setIsLoggedIn(true);
      setIsAdmin(false);
    } else {
      setIsLoggedIn(false);
    }
  }, [router]);

  const handleLogout = async () => {
    const admin = JSON.parse(localStorage.getItem('admin'));
    const user = JSON.parse(localStorage.getItem('user'));

    if (admin) {
      const { error } = await supabase
        .from('admin')
        .update({ is_online: false })
        .eq('id', admin.id);

      if (error) {
        console.error('Failed to update admin status', error);
      }

      localStorage.removeItem('admin');
    } else if (user) {
      const { error } = await supabase
        .from('users')
        .update({ is_online: false })
        .eq('id', user.id);

      if (error) {
        console.error('Failed to update user status', error);
      }

      localStorage.removeItem('user');
    }

    setIsLoggedIn(false);
    router.push(isAdmin ? '/admin/login' : '/');
  };

  return (
    <nav className="bg-violet-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-2xl font-bold">
          Voting System
        </div>
        <div className="flex items-center">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="text-white mr-4"
            >
              Logout
            </button>
          ) : (
            <>
              <Link href="/user/login" className="text-white mr-4">User Login</Link>
              <Link href="/admin/login" className="text-white">Admin Login</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
```

### UserLoginForm
The `UserLoginForm` component is used for user login.
#### File: `components/UserLoginForm.js`
```javascript
import { useState } from 'react';
import supabase from '../utils/supabase';
import { useRouter } from 'next/router';
import bcrypt from 'bcryptjs';

export default function UserLoginForm() {
  const [nim, setNim] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Fetch user data from Supabase
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('nim', nim)
        .single();

      if (error) {
        setError('Invalid NIM or password');
        return;
      }

      // Verify password
      if (user && bcrypt.compareSync(password, user.password)) {
        // Update user status to online
        const { error: updateError } = await supabase
          .from('users')
          .update({ is_online: true })
          .eq('id', user.id);

        if (updateError) {
          setError('Failed to update user status');
          return;
        }

        localStorage.setItem('user', JSON.stringify(user));
        router.push('/user');
      } else {
        setError('Invalid NIM or password');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold text-center">User Login</h2>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <form onSubmit={handleLogin} className="mt-4">
        <label htmlFor="nim" className="block text-sm font-medium text-gray-700">
          NIM
        </label>
        <input
          type="text"
          id="nim"
          value={nim}
          onChange={(e) => setNim(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500"
        />
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mt-4">
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500"
        />
        <button
          type="submit"
          className="mt-6 w-full bg-violet-600 text-white py-2 px-4 rounded-md hover:bg-violet-700"
        >
          Login
        </button>
      </form>
    </div>
  );
}
```

### AdminLoginForm
The `AdminLoginForm` component is used for admin login.
#### File: `components/AdminLoginForm.js`
```javascript
import { useState } from 'react';
import supabase from '../utils/supabase';
import { useRouter } from 'next/router';
import bcrypt from 'bcryptjs';

export default function AdminLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Fetch admin data from Supabase
      const { data: admin, error } = await supabase
        .from('admin')
        .select('*')
        .eq('email', email)
        .single();

      if (error) {
        setError('Invalid email or password');
        return;
      }

      // Verify password
      if (admin && bcrypt.compareSync(password, admin.password)) {
        localStorage.setItem('admin', JSON.stringify(admin));
        router.push('/admin/dashboard');
      } else {
        setError('Invalid email or password');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold text-center">Admin Login</h2>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <form onSubmit={handleLogin} className="mt-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500"
        />
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mt-4">
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500"
        />
        <button
          type="submit"
          className="mt-6 w-full bg-violet-600 text-white py-2 px-4 rounded-md hover:bg-violet-700"
        >
          Login
        </button>
      </form>
    </div>
  );
}
```

## Authentication
Using Supabase for user authentication and admin data storage.

## Configuration
- **Supabase:** Create a Supabase project and add the URL and Anon Key in the `.env.local` file.
- **Tailwind CSS:** Tailwind CSS is pre-configured in this project. You can adjust the configuration in `tailwind.config.js`.

## Improving the Project
1. **Add Voting Feature:**
   - Create a `votes` table in Supabase.
   - Add logic to process and store votes on the frontend and backend.

2. **Add Form Validation:**
   - Use libraries like `yup` or `react-hook-form` for form input validation.

3. **Add Route Protection:**
   - Ensure that admin pages are accessible only by authenticated users.

## Contributing

1. Fork the repository.
2. Create a new branch ([`git checkout -b feature-branch`](command:_github.copilot.openSymbolFromReferences?%5B%22git%20checkout%20-b%20feature-branch%22%2C%5B%7B%22uri%22%3A%7B%22%24mid%22%3A1%2C%22fsPath%22%3A%22%2Fworkspaces%2Ffinance-manager%2FREADME.md%22%2C%22external%22%3A%22file%3A%2F%2F%2Fworkspaces%2Ffinance-manager%2FREADME.md%22%2C%22path%22%3A%22%2Fworkspaces%2Ffinance-manager%2FREADME.md%22%2C%22scheme%22%3A%22file%22%7D%2C%22pos%22%3A%7B%22line%22%3A122%2C%22character%22%3A30%7D%7D%5D%5D "Go to definition")).
3. Make your changes.
4. Commit your changes ([`git commit -m 'Add some feature'`](command:_github.copilot.openSymbolFromReferences?%5B%22git%20commit%20-m%20'Add%20some%20feature'%22%2C%5B%7B%22uri%22%3A%7B%22%24mid%22%3A1%2C%22fsPath%22%3A%22%2Fworkspaces%2Ffinance-manager%2FREADME.md%22%2C%22external%22%3A%22file%3A%2F%2F%2Fworkspaces%2Ffinance-manager%2FREADME.md%22%2C%22path%22%3A%22%2Fworkspaces%2Ffinance-manager%2FREADME.md%22%2C%22scheme%22%3A%22file%22%7D%2C%22pos%22%3A%7B%22line%22%3A124%2C%22character%22%3A30%7D%7D%5D%5D "Go to definition")).
5. Push to the branch ([`git push origin feature-branch`](command:_github.copilot.openSymbolFromReferences?%5B%22git%20push%20origin%20feature-branch%22%2C%5B%7B%22uri%22%3A%7B%22%24mid%22%3A1%2C%22fsPath%22%3A%22%2Fworkspaces%2Ffinance-manager%2FREADME.md%22%2C%22external%22%3A%22file%3A%2F%2F%2Fworkspaces%2Ffinance-manager%2FREADME.md%22%2C%22path%22%3A%22%2Fworkspaces%2Ffinance-manager%2FREADME.md%22%2C%22scheme%22%3A%22file%22%7D%2C%22pos%22%3A%7B%22line%22%3A122%2C%22character%22%3A42%7D%7D%5D%5D "Go to definition")).
6. Open a pull request.

## 👨‍💻 Authors
**Developed by :**
**Muhamad Nur Arif**

### 🔗 Link
[![portfolio](https://img.shields.io/badge/my_portfolio-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://arifsuz.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/arifsuz)
[![linkedin](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/marif8/)
[![instagram](https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://www.instagram.com/arif_suz/)