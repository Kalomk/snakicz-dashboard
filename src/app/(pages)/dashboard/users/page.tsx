import { Users } from '@/api/users';
import RenderList from '@/components/RenderList';
import FilteredData from '@/components/filters';
import UserForm from '@/components/users/userForm';
import { checkAuth } from '@/utils/checkAuth';

export const dynamic = 'force-dynamic';

const UserPage = async () => {
  //auth check

  await checkAuth();
  const users = await Users.getUsers('1');
  return (
    <RenderList
      dataComponent={<FilteredData dataToFilter={users} filterSchemaType={'users'} />}
      formComponent={<UserForm />}
    />
  );
};

export default UserPage;
