import { MoreHorizontal } from "lucide-react";

type User = {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  emailVerified: boolean;
  createdAt: string;
};

export default function UsersDesktop({
  paginatedUsers,
}: {
  paginatedUsers: User[];
}) {
  return (
    <div className="hidden overflow-hidden rounded-2xl border border-black/10 bg-white/80 backdrop-blur-sm dark:border-[rgba(244,244,242,0.08)] dark:bg-panel/60 sm:block">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-black/10 bg-black/5 text-xs uppercase tracking-wider text-cloud/40 dark:border-[rgba(244,244,242,0.08)] dark:bg-white/5">
            <th className="py-3 pl-4 pr-4 font-medium sm:pl-6">User</th>
            <th className="py-3 pr-4 font-medium">Email</th>
            <th className="py-3 pr-4 font-medium">Role</th>
            <th className="py-3 pr-4 font-medium">Verified</th>
            <th className="py-3 pr-4 font-medium">Joined</th>
            <th className="py-3 pr-4 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedUsers.map((user) => (
            <tr
              key={user._id}
              className="border-b border-black/5 last:border-0 dark:border-[rgba(244,244,242,0.05)]"
            >
              <td className="py-3 pl-4 pr-4 sm:pl-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-medium capitalize text-accent">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <span className="font-medium capitalize text-cloud">
                    {user.name}
                  </span>
                </div>
              </td>
              <td className="py-3 pr-4 text-cloud/70">{user.email}</td>
              <td className="py-3 pr-4">
                <span
                  className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize ${
                    user.role === "admin"
                      ? "bg-accent/10 text-accent"
                      : "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400"
                  }`}
                >
                  {user.role}
                </span>
              </td>
              <td className="py-3 pr-4">
                {user.emailVerified ? (
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs text-cloud/40">
                    <span className="h-1.5 w-1.5 rounded-full bg-cloud/30" />
                    Pending
                  </span>
                )}
              </td>
              <td className="py-3 whitespace-nowrap text-cloud/50">
                {formatDate(user.createdAt)}
              </td>
              <td className="py-3 pr-4">
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-cloud/40 transition hover:bg-black/5 hover:text-cloud dark:hover:bg-white/5"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
