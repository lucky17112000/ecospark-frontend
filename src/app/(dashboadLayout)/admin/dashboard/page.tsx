import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <ul>
        <li>
          <Link href="/admin/dashboard/idea-managment">Idea management</Link>
        </li>
        <li>
          <Link href="/admin/dashboard/user-mangment">User management</Link>
        </li>
      </ul>
    </div>
  );
}
