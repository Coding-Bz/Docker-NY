# Project Documentation

## How to start this application?

To start this application, follow these steps:

1. **Launch Docker**
   - Ensure Docker is running on your machine.
   - Start PostgreSQL container:
     ```
     docker run --name postgres_db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres
     ```
   - Verify the database is running:
     ```
     docker ps
     ```

3.  **Start Backend**: Run the backend application.
4. **Start Frontend**:
   Prerequisites
   - Node.js (version 16 or higher)
     - Download from: https://nodejs.org/
     - To check if installed, open a terminal and run:
       `node --version`
   - Yarn (package manager)
     - After installing Node.js, install Yarn by running:
       `npm install -g yarn`
     - To check if installed, run:
       `yarn --version`
   - Git (version control)
     - Download from: https://git-scm.com/
     - To check if installed, run:
       `git --version`

   Navigate to the frontend directory and enter the following command:

    `yarn dev`

After these steps, you should be automatically forwarded to [http://localhost:3000](http://localhost:3000).

---

## Login Daten

| Email | Passwort | Rolle |
| :--- | :--- | :--- |
| admin@example.com | 1234 | Admin |
| example@example.com | 1234 | User |

---

## Use Cases

### 5.1 User Profile
* **UC1**: User erstellt eigenes Profil
* **UC2**: User liest und aktualisiert eigenes Profil
* **UC3**: User löscht eigenes Profil
* **UC4**: Admin löscht beliebiges UserProfile
* **UC5**: Admin sucht, filtert und sortiert alle UserProfiles

---

## Testing

We utilize three main testing methods:

* **Cypress**: For end-to-end testing (primarily frontend-focused).
* **Postman**: For component testing (backend-focused).
* **Black Box testing**: A balanced combination of both.

### Black Box Testing
For the Black Box tests, we had a user with no prior knowledge of the code test the application; the results can be found in the documentation uploaded to our frontend repository.

### Postman
To use Postman, ensure that **Docker is running** and the **backend application is started**. You will also need Postman installed on your machine. Once installed, open the test files we provided to find various tests covering the entire application.

### Cypress
You can locate the test file in the frontend repository and execute it. These tests fully validate **Use Cases 2 and 5**. While other use cases are included in the testing suite, Use Cases 2 and 5 are the most comprehensively tested.

---

## Frontend-URL

| Route         | Access Level | Description          | Special Notes                                                                 |
|---------------|--------------|----------------------|--------------------------------------------------------------------------------|
| `/`           | Public       | Home / Landing Page  | Entry point of the application.                                               |
| `/user/login` | Public       | Login Page           | Authentication for users and admins. After registration, the user has the USER role by default. |
| `/user/login` | Public       | Registration Page    | New users can be created by clicking the sign-up link.                        |
| `/user`       | User         | Profile View         | A regular user can only see their own data.                                   |
| `/user`       | Admin        | User List            | An admin can see all registered users.                                        |
| `/user/admin` | Admin        | Dashboard            | Central management with filtering, pagination, and sorting.                  |

