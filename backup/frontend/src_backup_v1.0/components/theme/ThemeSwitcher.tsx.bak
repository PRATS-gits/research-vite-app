import * as React from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';
import type { Theme } from '@/store/themeStore';

interface ThemeSwitcherProps {
  className?: string;
  showDropdown?: boolean;
}

export function ThemeSwitcher({ className, showDropdown = true }: ThemeSwitcherProps) {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();

  // Simple toggle version (no dropdown)
  if (!showDropdown) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleTheme}
        className={cn(
          'h-9 w-9 p-0 hover:bg-accent/50 transition-all duration-300',
          className
        )}
        aria-label={`Switch to ${resolvedTheme === 'light' ? 'dark' : 'light'} theme`}
      >
        <div className="relative">
          <Sun 
            className={cn(
              'h-4 w-4 transition-all duration-300 rotate-0 scale-100',
              resolvedTheme === 'dark' && 'rotate-90 scale-0'
            )} 
          />
          <Moon 
            className={cn(
              'absolute top-0 left-0 h-4 w-4 transition-all duration-300 rotate-90 scale-0',
              resolvedTheme === 'dark' && 'rotate-0 scale-100'
            )} 
          />
        </div>
      </Button>
    );
  }

  // Dropdown version with all theme options
  const themeOptions: Array<{ value: Theme; label: string; icon: React.ReactNode }> = [
    { value: 'light', label: 'Light', icon: <Sun className="h-4 w-4" /> },
    { value: 'dark', label: 'Dark', icon: <Moon className="h-4 w-4" /> },
    { value: 'system', label: 'System', icon: <Monitor className="h-4 w-4" /> },
  ];

  const currentIcon = React.useMemo(() => {
    if (theme === 'system') {
      return <Monitor className="h-4 w-4" />;
    }
    return resolvedTheme === 'light' ? (
      <Sun className="h-4 w-4" />
    ) : (
      <Moon className="h-4 w-4" />
    );
  }, [theme, resolvedTheme]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            'h-9 w-9 p-0 hover:bg-accent/50 transition-colors duration-200',
            className
          )}
          aria-label="Toggle theme"
        >
          <div className="transition-transform duration-200 hover:rotate-12">
            {currentIcon}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[120px]">
        {themeOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => setTheme(option.value)}
            className={cn(
              'flex items-center gap-2 cursor-pointer',
              theme === option.value && 'bg-accent text-accent-foreground'
            )}
          >
            {option.icon}
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}