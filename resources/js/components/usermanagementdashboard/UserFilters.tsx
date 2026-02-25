import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { SlidersHorizontal } from "lucide-react";
import { UserFiltersData } from "@/types/filters";

interface UserFiltersProps {
  filters: UserFiltersData;
  setFilters: (filters: UserFiltersData) => void;
  onFilter: (filters: UserFiltersData) => void;
}

export default function UserFilters({ filters, setFilters, onFilter }: UserFiltersProps) {
  const [localFilters, setLocalFilters] = useState<UserFiltersData>(filters);
  const [open, setOpen] = useState(false);

  const handleApply = () => {
    const applied: UserFiltersData = {
      role: localFilters.role || "any",
    };

    setFilters(applied);
    onFilter(applied);
    setOpen(false);
  };

  const handleCancel = () => {
    setLocalFilters(filters);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center gap-4 px-4 py-4 rounded-md border border-black/20 dark:border-white/20 bg-transparent text-gray-900 dark:text-gray-100 shadow-sm focus:shadow-md transition-shadow duration-300">
          <SlidersHorizontal className="w-4 h-4 " />
          Filters
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-64 p-4 space-y-4 bg-white dark:bg-gray-800 rounded-md shadow-xl border border-gray-200">
        <h2 className="text-lg font-semibold">User Filters</h2>

        {/* ROLE */}
        <div className="space-y-1 ">
          <label className="text-sm font-small">Role</label>
          <Select
            value={localFilters.role || "any"}
            onValueChange={(val) =>
              setLocalFilters({ ...localFilters, role: val as "any" | "admin" | "user" })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* BUTTONS */}
        <div className="flex justify-between pt-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleApply}>Apply Filters</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
