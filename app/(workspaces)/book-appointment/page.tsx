import { redirect } from 'next/navigation'

const InvalidPage = () => {
  redirect('/?msg=The page url was not found!')
}

export default InvalidPage