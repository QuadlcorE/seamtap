'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Card,
  CardContent,
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { MoreHorizontal, Search } from 'lucide-react'
import AddFamily from '../components/ui/addfamily'

// Mock data for demonstration
const mockFamilies = [
  { id: '1', name: 'Smith Family', members: 5, createdBy: 'John Doe', createdAt: '2023-10-01' },
  { id: '2', name: 'Johnson Family', members: 3, createdBy: 'Jane Smith', createdAt: '2023-10-05' },
  { id: '3', name: 'Williams Family', members: 4, createdBy: 'John Doe', createdAt: '2023-10-08' },
  { id: '4', name: 'Brown Family', members: 2, createdBy: 'Jane Smith', createdAt: '2023-10-10' },
  { id: '5', name: 'Davis Family', members: 6, createdBy: 'John Doe', createdAt: '2023-10-15' },
]

export default function FamiliesPage() {
  // 
  const [searchQuery, setSearchQuery] = useState('')
  const [memberFilter, setMemberFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')

  // Filter families based on search query and filters
  const filteredFamilies = mockFamilies.filter(family => {
    const matchesSearch = family.name.toLowerCase().includes(searchQuery.toLowerCase())
    
    // Apply member filter
    const matchesMemberFilter = 
      memberFilter === 'all' ? true :
      memberFilter === 'more5' ? family.members > 5 :
      memberFilter === 'less5' ? family.members <= 5 : true
    
    // Apply date filter (simplified for demo)
    const matchesDateFilter = true // In a real app, you would implement date filtering logic
    
    return matchesSearch && matchesMemberFilter && matchesDateFilter
  })

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>Families</h1>
        <p className='text-muted-foreground mt-1'>
          Manage all your families here. Add new families, view their details,
          and organize customers into families.
        </p>
      </div>

      <div className="flex justify-between items-center">
        <AddFamily/>
      </div>

      <Card>
        <CardContent>
          <div className='flex flex-col space-y-4'>
            <div className='flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2'>
              <div className='relative flex-1'>
                <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
                <Input
                  placeholder='Search families...'
                  className='pl-8'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className='flex space-x-2'>
                <Select value={memberFilter} onValueChange={setMemberFilter}>
                  <SelectTrigger className='w-32'>
                    <SelectValue placeholder='Members' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>All Members</SelectItem>
                    <SelectItem value='more5'>More than 5</SelectItem>
                    <SelectItem value='less5'>5 or less</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className='w-32'>
                    <SelectValue placeholder='Date' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>All Time</SelectItem>
                    <SelectItem value='7days'>Last 7 days</SelectItem>
                    <SelectItem value='30days'>Last 30 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {filteredFamilies.length > 0 ? (
              <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Family Name</TableHead>
                        <TableHead>Members</TableHead>
                        <TableHead>Created By</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead className='w-[100px]'>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredFamilies.map((family) => (
                        <TableRow key={family.id}>
                          <TableCell className='font-medium'>
                            <Link
                              href={`/families/${family.id}`}
                              className='hover:underline'
                            >
                              {family.name}
                            </Link>
                          </TableCell>
                          <TableCell>{family.members}</TableCell>
                          <TableCell>{family.createdBy}</TableCell>
                          <TableCell>{family.createdAt}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant='ghost' className='h-8 w-8 p-0'>
                                  <span className='sr-only'>Open menu</span>
                                  <MoreHorizontal className='h-4 w-4' />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align='end'>
                                <DropdownMenuItem asChild>
                                  <Link href={`/families/${family.id}`}>
                                    View
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link href={`/families/${family.id}/edit`}>
                                    Edit
                                  </Link>
                                </DropdownMenuItem>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <DropdownMenuItem
                                      onSelect={(e) => e.preventDefault()}
                                    >
                                      Delete
                                    </DropdownMenuItem>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        Delete Family
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete{" "}
                                        {family.name}? This action cannot be
                                        undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>
                                        Cancel
                                      </AlertDialogCancel>
                                      <AlertDialogAction className='bg-destructive text-destructive-foreground'>
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                <div className='text-sm text-muted-foreground'>
                  Showing {filteredFamilies.length} of {mockFamilies.length}{" "}
                  families
                </div>
              </>
            ) : (
              <div className='flex h-36 flex-col items-center justify-center rounded-md border border-dashed p-8 text-center'>
                <h3 className='font-medium'>No families found</h3>
                <p className='text-sm text-muted-foreground mt-1'>
                  Click &apos;Add New Family&apos; to get started.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}