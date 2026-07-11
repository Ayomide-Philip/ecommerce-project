type User = {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  emailVerified: boolean;
  createdAt: string;
};

export default function UsersMobile({
  paginatedUsers,
}: {
  paginatedUsers: User[];
}) {
  return (
    <div className="space-y-3 sm:hidden">
      {paginatedUsers.map((user) => (
        <div
          key={user._id}
          className="rounded-2xl border border-black/10 bg-white/80 p-4 backdrop-blur-sm dark:border-[rgba(244,244,242,0.08)] dark:bg-panel/60"
        >
          <div className="mb-3 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10 text-sm font-medium capitalize text-accent">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <div>
                <p className="text-sm font-medium capitalize text-cloud">
                  {user.name}
                </p>
                <p className="text-xs text-cloud/50">{user.email}</p>
              </div>
            </div>
            <span
              className={`inline-block shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize ${
                user.role === "admin"
                  ? "bg-accent/10 text-accent"
                  : "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400"
              }`}
            >
              {user.role}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 border-t border-black/5 pt-3 text-xs dark:border-[rgba(244,244,242,0.05)]">
            <div>
              <span className="block text-cloud/40">Verified</span>
              <span
                className={
                  user.emailVerified ? "text-emerald-500" : "text-cloud/40"
                }
              >
                {user.emailVerified ? "Yes" : "No"}
              </span>
            </div>
            <div>
              <span className="block text-cloud/40">Joined</span>
              <span className="text-cloud/70">
                {formatDate(user.createdAt)}
              </span>
            </div>
          </div>
        </div>
      ))}
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
