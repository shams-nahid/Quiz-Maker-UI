"use client";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { increment, decrement } from "@/store/slices/counterSlice";
import { Button } from "@/components/ui";
import { useTheme } from "@/context";

export default function Home() {
  const count = useAppSelector(state => state.counter.value);
  const dispatch = useAppDispatch();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className='p-8'>
      <div className='mb-4'>
        <Button onClick={toggleTheme} variant='secondary'>
          Theme: {theme}
        </Button>
      </div>

      <h1 className='text-2xl font-bold mb-4'>Counter: {count}</h1>
      <div className='space-x-2'>
        <Button onClick={() => dispatch(increment())}>+</Button>
        <Button variant='danger' onClick={() => dispatch(decrement())}>
          -
        </Button>
      </div>
    </div>
  );
}
