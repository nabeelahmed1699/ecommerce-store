'use client';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { deleteProduct, toggleProductAvailability } from '../../_actions/products';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';

type ActiveToggleDropdownItemProps = {
  id: string;
  isAvailableForPurchase: boolean;
};
export function ActiveToggleDropdownItem({ id, isAvailableForPurchase }: ActiveToggleDropdownItemProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <DropdownMenuItem
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await toggleProductAvailability(id, !isAvailableForPurchase);
          router.refresh()
        });
      }}
    >
      {isAvailableForPurchase ? 'Deactivate' : 'Activate'}
    </DropdownMenuItem>
  );
}

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
          await deleteProduct(id);
          router.refresh();
        });
      }}
      className='text-destructive hover:bg-red-400 hover:text-white'
    >
      {isPending ? 'Deleting' : 'Delete'}
    </DropdownMenuItem>
  );
}
