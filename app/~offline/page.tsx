export const metadata = {
  title: "Offline | HRMS",
};

export default function OfflinePage() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background text-foreground p-6">
      <svg
        className="mb-4 h-16 w-16 text-muted-foreground"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="2" y1="2" x2="22" y2="22" />
        <path d="M8.53 8.53a10 10 0 0 1 10.94 1.2" />
        <path d="M5 12.859a10 10 0 0 1-3-2.14 16 16 0 0 1 20 0" />
        <path d="M11 16.3a4 4 0 0 1 5.6 0" />
        <path d="M8 12.859a4 4 0 0 1 2.5-1" />
        <line x1="12" y1="20" x2="12.01" y2="20" />
      </svg>
      <h1 className="text-2xl font-bold tracking-tight">You are offline</h1>
      <p className="mt-2 text-muted-foreground text-center max-w-[400px]">
        It looks like you don't have an internet connection. Please check your network settings and try again.
      </p>
    </div>
  );
}
