'use client';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { deleteOrder } from '../../_actions/orders';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';


type DeleteDropdownItemProps = {
  id: string;
  disabled: boolean;
};
export function DeleteDropdownItem({ id, disabled }: DeleteDropdownItemProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  return (
    <DropdownMenuItem
      disabled={isPending || disabled}
      onClick={() => {
        startTransition(async () => {
          await deleteOrder(id);
          router.refresh();
        });
      }}
      className='text-destructive hover:bg-red-400 hover:text-white'
    >
      {isPending ? 'Deleting' : 'Delete'}
    </DropdownMenuItem>
  );
}
