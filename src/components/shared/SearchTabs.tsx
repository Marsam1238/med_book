'use client';

import { useState } from 'react';
import {
  CheckCircle,
  FileUp,
  Pill,
  Microscope,
  Search,
  Check,
  ChevronsUpDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { doctorSpecializations, labTestCategories } from '@/lib/data';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

function Combobox({
  items,
  placeholder,
  value,
  onChange,
}: {
  items: string[];
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between text-muted-foreground"
        >
          {value
            ? items.find((item) => item.toLowerCase() === value.toLowerCase())
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder={`Search ${placeholder.toLowerCase()}...`} />
          <CommandList>
            <CommandEmpty>No item found.</CommandEmpty>
            <CommandGroup>
              {items
                .filter((item) => item !== 'All')
                .map((item) => (
                  <CommandItem
                    key={item}
                    value={item}
                    onSelect={(currentValue) => {
                      onChange(currentValue.toLowerCase() === value.toLowerCase() ? '' : currentValue);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        value.toLowerCase() === item.toLowerCase()
                          ? 'opacity-100'
                          : 'opacity-0'
                      )}
                    />
                    {item}
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function PrescriptionUpload() {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!file) {
      toast({
        variant: 'destructive',
        title: 'No file selected',
        description: 'Please select a prescription file to upload.',
      });
      return;
    }
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      setFile(null);
      toast({
        title: 'Upload Successful',
        description: `Your prescription "${file.name}" has been uploaded.`,
        action: <CheckCircle className="text-green-500" />,
      });
    }, 1500);
  };

  return (
    <div className="space-y-4 text-left">
      <div>
        <Label className="font-medium">Select Purpose</Label>
        <RadioGroup defaultValue="lab-test" className="mt-2 flex space-x-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="lab-test" id="lab-test" />
            <Label htmlFor="lab-test">
              <Microscope className="inline-block mr-2 h-4 w-4" /> Lab Test
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="medicine" id="medicine" />
            <Label htmlFor="medicine">
              <Pill className="inline-block mr-2 h-4 w-4" /> Medicine
            </Label>
          </div>
        </RadioGroup>
      </div>
      <div>
        <Label htmlFor="prescription-file">Upload Prescription</Label>
        <Input
          id="prescription-file"
          type="file"
          className="mt-2"
          onChange={handleFileChange}
        />
        {file && (
          <p className="mt-2 text-sm text-muted-foreground">
            Selected file: {file.name}
          </p>
        )}
      </div>
      <Button onClick={handleUpload} disabled={uploading} className="w-full">
        <FileUp className="mr-2 h-4 w-4" />
        {uploading ? 'Uploading...' : 'Upload Prescription'}
      </Button>
    </div>
  );
}

export function SearchTabs() {
  const router = useRouter();
  const [doctorFilter, setDoctorFilter] = useState('');
  const [labFilter, setLabFilter] = useState('');

  const handleDoctorSearch = () => {
    const params = new URLSearchParams();
    if (doctorFilter) {
      params.set('specialization', doctorFilter);
    }
    router.push(`/?${params.toString()}#doctors`);
  };

  const handleLabSearch = () => {
    const params = new URLSearchParams();
    if (labFilter) {
      params.set('category', labFilter);
    }
    router.push(`/?${params.toString()}#lab-tests`);
  };

  return (
    <Tabs defaultValue="doctor" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="doctor">Find a Doctor</TabsTrigger>
        <TabsTrigger value="lab">Book a Lab Test</TabsTrigger>
        <TabsTrigger value="prescription">Upload</TabsTrigger>
      </TabsList>
      <TabsContent value="doctor" className="mt-6">
        <div className="space-y-4">
          <Combobox
            items={doctorSpecializations}
            placeholder="Select a Specialization"
            value={doctorFilter}
            onChange={setDoctorFilter}
          />
          <Button className="w-full" onClick={handleDoctorSearch}>
            <Search className="mr-2 h-4 w-4" /> Search Doctors
          </Button>
        </div>
      </TabsContent>
      <TabsContent value="lab" className="mt-6">
        <div className="space-y-4">
          <Combobox
            items={labTestCategories}
            placeholder="Select a Test Category"
            value={labFilter}
            onChange={setLabFilter}
          />
          <Button className="w-full" onClick={handleLabSearch}>
            <Search className="mr-2 h-4 w-4" /> Search Lab Tests
          </Button>
        </div>
      </TabsContent>
      <TabsContent value="prescription" className="mt-6">
        <PrescriptionUpload />
      </TabsContent>
    </Tabs>
  );
}
