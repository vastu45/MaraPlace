export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t py-8 text-center text-gray-600 dark:text-gray-400">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-4">
        <div className="font-bold text-green-600 text-lg">MaraPlace</div>
        <div className="flex gap-6 text-sm">
          <a href="#" className="hover:text-green-600">About</a>
          <a href="#" className="hover:text-green-600">Contact</a>
          <a href="#" className="hover:text-green-600">Terms</a>
          <a href="#" className="hover:text-green-600">Privacy</a>
        </div>
        <div className="text-xs mt-2 md:mt-0">&copy; {new Date().getFullYear()} MaraPlace. All rights reserved.</div>
      </div>
    </footer>
  );
} 