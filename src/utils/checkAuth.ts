import { cookies } from 'next/headers';
import axios from '../core/axios';
import { redirect } from 'next/navigation';
import { Users } from '@/api/users';

export const checkAuth = async () => {
  const nextCookies = cookies();
  const _token = nextCookies.get('token'); // Find cookie

  // Check if token is missing
  if (!_token) redirect('/auth');
  try {
    console.log(_token);
    // Call API to check authentication
    const user = await Users.getSensetiveData(_token.value);

    console.log('Successful auth check');

    return user;
  } catch (error) {
    console.log('Check failed: ' + (error as any).response.data.message);

    redirect('/auth');
  }
};
