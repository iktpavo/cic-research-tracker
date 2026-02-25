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
import { ProposalFiltersData } from "@/types/filters";

interface ProposalFiltersProps {
  filters: ProposalFiltersData;
  setFilters: (filters: ProposalFiltersData) => void;
  onFilter: (filters: ProposalFiltersData) => void;
}

export default function ProposalFilters({ filters, setFilters, onFilter }: ProposalFiltersProps) {
  const [localFilters, setLocalFilters] = useState<ProposalFiltersData>(filters);
  const [open, setOpen] = useState(false);

  const handleApply = () => {
    const applied: ProposalFiltersData = {
      program: localFilters.program || 'any',
      year_completed: localFilters.year_completed || 'any',
      sort: localFilters.sort || 'default',
      search: localFilters.search,
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
        <Button variant="outline" className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-4 space-y-4 bg-white dark:bg-gray-800 rounded-md shadow-xl border border-gray-200">
        <h2 className="text-lg font-semibold">Proposal Filters</h2>

        {/* PROGRAM */}
        <div className="space-y-1">
          <label className="text-sm font-small">Program</label>
          <Select
            value={localFilters.program || "any"}
            onValueChange={(val) => setLocalFilters({ ...localFilters, program: val })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="BSIT">BSIT</SelectItem>
              <SelectItem value="BLIS">BLIS</SelectItem>
              <SelectItem value="BSCS">BSCS</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* YEAR COMPLETED */}
        <div className="space-y-1">
          <label className="text-sm font-small">Year Completed</label>
          <input
            type="number"
            placeholder="YYYY"
            value={localFilters.year_completed || ""}
            onChange={(e) => setLocalFilters({ ...localFilters, year_completed: e.target.value })}
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>

        {/* SORT */}
        <div className="space-y-1">
          <label className="text-sm font-small">Sort by Research Title</label>
          <Select
            value={localFilters.sort || "default"}
            onValueChange={(val) => setLocalFilters({ ...localFilters, sort: val as "default" | "asc" | "desc" })}
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