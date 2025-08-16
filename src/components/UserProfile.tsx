interface UserProfileProps {
  name?: string;
  email?: string;
  role?: string;
}

export default function UserProfile({ name, email, role }: UserProfileProps) {
  return (
    <div data-testid='user-profile'>
      <h2>User Profile</h2>
      {name ? (
        <p data-testid='user-name'>Name: {name}</p>
      ) : (
        <p data-testid='no-name'>No name provided</p>
      )}

      {email ? (
        <p data-testid='user-email'>Email: {email}</p>
      ) : (
        <p data-testid='no-email'>No email provided</p>
      )}

      {role && <p data-testid='user-role'>Role: {role}</p>}
    </div>
  );
}
