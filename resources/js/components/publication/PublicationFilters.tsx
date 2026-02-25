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
import { PublicationFiltersData } from "@/types/filters";

interface PublicationFiltersProps {
  filters: PublicationFiltersData;
  setFilters: (filters: PublicationFiltersData) => void;
  onFilter: (filters: PublicationFiltersData) => void;
}

export default function PublicationFilters({
  filters,
  setFilters,
  onFilter,
}: PublicationFiltersProps) {
  const [localFilters, setLocalFilters] = useState<PublicationFiltersData>(filters);
  const [open, setOpen] = useState(false);

  const handleApply = () => {
    const appliedFilters: PublicationFiltersData = {
      publication_program: localFilters.publication_program || "any",
      year_from: localFilters.year_from,
      year_to: localFilters.year_to,
      sort: localFilters.sort || "default",
      search: localFilters.search,
    };
    setFilters(appliedFilters);
    onFilter(appliedFilters);
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
        <h2 className="text-lg font-semibold">Publication Filters</h2>

        {/* PROGRAM */}
        <div className="space-y-1">
          <label className="text-sm font-small">Program</label>
          <Select
            value={localFilters.publication_program || "any"}
            onValueChange={(val) =>
              setLocalFilters({ ...localFilters, publication_program: val })
            }
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

        {/* YEAR RANGE */}
        <div className="flex items-center gap-2">
            {/* Year From */}
            <div className="flex-1 flex flex-col">
                <label className="text-sm font-medium mb-1">Year From</label>
                <input
                type="number"
                placeholder="e.g., 2020"
                value={localFilters.year_from || ""}
                onChange={(e) =>
                    setLocalFilters({ ...localFilters, year_from: e.target.value })
                }
                className="w-full border rounded px-3 py-2 text-sm"
                />
            </div>

            {/* Centered dash */}
             <div className="flex flex-col justify-end">
                <span className="text-sm font-medium mt-3">_</span>
            </div>

            {/* Year To */}
            <div className="flex-1 flex flex-col">
                <label className="text-sm font-medium mb-1">Year To</label>
                <input
                type="number"
                placeholder="e.g., 2023"
                value={localFilters.year_to || ""}
                onChange={(e) =>
                    setLocalFilters({ ...localFilters, year_to: e.target.value })
                }
                className="w-full border rounded px-3 py-2 text-sm"
                />
            </div>
            </div>


        {/* SORT */}
        <div className="space-y-1">
          <label className="text-sm font-small">Sort by Title</label>
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
          <Button onClick={handleApply}>
            Apply Filters
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
