// Components
import ThemeSwitcher from "@/components/ThemeSwitcher";

// UI components
import { Card } from "./ui/card";

export default function Footer() {
  return (
    <Card className="header flex justify-between items-center mb-5">
      <span className="text-sm text-gray-600 dark:text-gray-400">
        Status Page demo application, 2025
      </span>
      <ThemeSwitcher />
    </Card>
  );
}
