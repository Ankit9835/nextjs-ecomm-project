'use client';
import { Input } from '../ui/input';
import { useSearchParams, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { useState, useEffect } from 'react';

function NavSearch() {
  const searchparams = useSearchParams()
  const {replace} = useRouter()
  const [search,setSearch] = useState(searchparams.get('search')?.toString()) || ''

  const handleChange = useDebouncedCallback((value:string) => {
    const params = new URLSearchParams(searchparams)
    if(value){
      params.set('search',value)
    } else {
      params.delete('search')
    }
    replace(`/products?${params.toString()}`)
  }, 200)

  useEffect(() => {
    if (!searchparams.get('search')) {
      setSearch('');
    }
  }, [searchparams.get('search')]);
  return (
    <Input
      type='search'
      placeholder='search product...'
      className='max-w-xs dark:bg-muted '
      onChange={(e) => {
        setSearch(e.target.value)
        handleChange(e.target.value)
      }}
      value={search}
    />
  );
}
export default NavSearch;