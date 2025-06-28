import prisma from '@/lib/prisma';

// Bu sayfa, veritabanından tüm kullanıcıları çeker ve bir tabloda listeler.
export default async function AdminDashboardPage() {
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-pink-400">Admin Cockpit: All Users</h1>
      <div className="bg-gray-900/50 rounded-lg border border-gray-700">
        <table className="w-full text-left">
          <thead className="border-b border-gray-600">
            <tr>
              <th className="p-4">Username</th>
              <th className="p-4">Email</th>
              <th className="p-4">Membership Tier</th>
              <th className="p-4">Registration Date</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                <td className="p-4">{user.username}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4 font-mono">{user.membershipTier}</td>
                <td className="p-4">{new Date(user.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}