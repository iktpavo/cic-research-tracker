import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { UtilizationFiltersData } from "@/types/filters";
import { SelectValue } from "../ui/select";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";

interface UtilizationFiltersProps {
  filters: UtilizationFiltersData;
  setFilters: (filters: UtilizationFiltersData) => void;
  onFilter: (filters: UtilizationFiltersData) => void;
}

export default function UtilizationFilters({
  filters,
  setFilters,
  onFilter,
}: UtilizationFiltersProps) {
  const [localFilters, setLocalFilters] = useState<UtilizationFiltersData>(filters);
  const [open, setOpen] = useState<boolean>(false);

  const handleApply = () => {
    setFilters(localFilters);
    onFilter(localFilters);
    setOpen(false);
  };

  const handleCancel = () => {
    setLocalFilters(filters);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-4 space-y-4 bg-white dark:bg-gray-800 rounded-md shadow-xl border border-gray-200">
        <h2 className="text-lg font-semibold">Utilization Filters</h2>

        {/* CERTIFICATE DATE RANGE */}
        <div className="space-y-1">
          <label className="text-sm font-small">Certificate Date From</label>
          <Input
            type="date"
            value={localFilters.date_from || ""}
            onChange={(e) =>
              setLocalFilters({ ...localFilters, date_from: e.target.value })
            }
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-small">Certificate Date To</label>
          <Input
            type="date"
            value={localFilters.date_to || ""}
            onChange={(e) =>
              setLocalFilters({ ...localFilters, date_to: e.target.value })
            }
          />
        </div>

        {/* SORT BY RESEARCH TITLE */}
                <div className="space-y-1">
                    <label className="text-sm font-small">Sort by Research Title</label>
                    <Select
                        value={localFilters.sort || "default"}
                        onValueChange={(val) =>
                            setLocalFilters({ ...localFilters, sort: val as "default" | "asc" | "desc" })
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Default" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="default">Default</SelectItem>
                            <SelectItem value="asc">A → Z</SelectItem>
                            <SelectItem value="desc">Z → A</SelectItem>
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
