import { redirect } from 'middlewares/redirect';
import { NextPage } from 'next';
import { PageContext } from 'types';
import Link from 'next/link';
import Image from 'next/image';
import { Edit2, Menu, PlusCircle } from 'react-feather';
import ProfileCard from 'components/ProfileCard';
import Modal from 'components/Modal';
import { useEffect, useState } from 'react';
import { useUserInfo } from 'hooks/redux';
import { motion } from 'framer-motion';
import Input from 'components/Input';
import { Mail, X, User } from 'react-feather';
import Button from 'components/Button';
import { useForm } from 'react-hook-form';
import { useFormError } from 'hooks/validation';
import Loader from 'components/Loader';
import { useDispatch } from 'react-redux';
import { setUserInfo, updateUserInfo } from 'actions/user';
import { errorNotification } from 'helpers/notification';
import { emailPattern } from 'helpers/validation';
import { updateUser, uploadProfileImg } from 'services/user';
import { getTransaction, getTransactions } from 'services/transactions';
import { Transaction } from 'types/transaction';
import moment from 'moment';
import { DropzoneListItem } from 'types/dropzone';
import { getAllDropzones } from 'services/dropzone';
import nextCookie from 'next-cookies';
import setAuthToken from 'helpers/token';
import Drawer from 'components/Drawer';

type EditProfileFields = {
  firstName: string;
  lastName: string;
  email: string;
};

const tagColor = {
  CREATED: 'bg-green',
  COMPLETED: 'bg-purple',
};

const Profile: NextPage<Props> = ({ transactions, dropzones, currentTransactions }) => {
  console.log({ transactions, dropzones, currentTransactions });
  const { userInfo } = useUserInfo();
  const { register, handleSubmit, errors, setValue } = useForm<EditProfileFields>();
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useFormError(errors);

  useEffect(() => {
    // load state data into modal form
    if (isModalOpen) {
      setValue('email', userInfo.email);
      setValue('firstName', userInfo.fname);
      setValue('lastName', userInfo.lname);
    }
  }, [isModalOpen]);

  async function onUpdateProfile(data: EditProfileFields) {
    try {
      setIsLoading(true);

      const payload = {
        ...userInfo,
        fname: data.firstName,
        lname: data.lastName,
        email: data.email,
      };

      await updateUser(payload);

      dispatch(updateUserInfo(payload));

      setIsLoading(false);
      setIsModalOpen(false);
    } catch (e) {
      if (e?.response?.data?.message) {
        errorNotification('Error', e.response.data.message);
      } else {
        errorNotification('Error', 'An unexpected error has occurred. Please try again later.');
      }
      setIsLoading(false);
    }
  }

  async function handleProfileImgChange(e) {
    const file = e.target.files[0];
    try {
      setIsLoading(true);
      const imgURL = await uploadProfileImg(file);
      await updateUser({ ...userInfo, image_url: imgURL });
      setIsLoading(false);
      dispatch(updateUserInfo({ image_url: imgURL }));
    } catch (e) {
      setIsLoading(false);
      errorNotification(
        'Error',
        'An error occurred while uploading the image. Please try again later.'
      );
    }
  }

  if (!userInfo) return null;

  return (
    <article className="relative">
      {isLoading && <Loader />}
      <Drawer show={isMenuOpen} onClose={() => setIsMenuOpen(false)}>
        <li className="pb-4">
          {userInfo.role === '1' ? (
            <Link href="/dropzones">
              <a className="text-white text-xl tracking-wider">Dropzones</a>
            </Link>
          ) : (
            <a
              className="text-white text-xl tracking-wider"
              href="https://k1mkuyv4azb.typeform.com/to/SLNsiRUn"
              target="_blank"
              rel="noreferrer"
            >
              Become a Host
            </a>
          )}
        </li>
        <li className="pb-4">
          <Link href={`/?logout=${+new Date()}`}>
            <a className="text-white text-xl tracking-wider">Logout</a>
          </Link>
        </li>
      </Drawer>
      <Modal isOpen={isModalOpen}>
        <div className="bg-silver shadow-2xl rounded-xl max-w-3/4 lg:w-160 w-full p-8 relative flex overflow-hidden">
          <span
            className="absolute top-8 right-8 cursor-pointer"
            onClick={() => setIsModalOpen(false)}
          >
            <X size={24} color="#000" />
          </span>
          <form className="w-full flex flex-col" onSubmit={handleSubmit(onUpdateProfile)}>
            <h2 className="text-3xl mb-8 text-dark">Edit Profile</h2>
            <div className="pb-6 flex justify-between">
              <div className="w-1/2 pr-2">
                <label className="text-dark text-sm">First Name</label>
                <Input
                  name="firstName"
                  containerClassName="bg-white mt-2 rounded-md"
                  className="py-4 bg-white"
                  prefixElement={
                    <span>
                      <User size={16} color="#7E7E7E" />
                    </span>
                  }
                  placeholder="Your first name"
                  ref={register({
                    required: 'First name cannot be empty!',
                  })}
                />
              </div>
              <div className="w-1/2 pl-2">
                <label className="text-dark text-sm">Last Name</label>
                <Input
                  name="lastName"
                  containerClassName="bg-white mt-2 rounded-md"
                  className="py-4 bg-white"
                  prefixElement={
                    <span>
                      <User size={16} color="#7E7E7E" />
                    </span>
                  }
                  placeholder="Your last name"
                  ref={register({
                    required: 'Last name cannot be empty!',
                  })}
                />
              </div>
            </div>
            <div className="pb-6">
              <label className="text-dark text-sm">Email</label>
              <Input
                name="email"
                type="email"
                containerClassName="bg-white mt-2 rounded-md"
                className="py-4 bg-white"
                prefixElement={
                  <span>
                    <Mail size={16} color="#7E7E7E" />
                  </span>
                }
                placeholder="example@gmail.com"
                ref={register({
                  required: 'Email cannot be empty!',
                  pattern: {
                    value: emailPattern,
                    message: 'Incorrect email format!',
                  },
                })}
              />
            </div>
            <div>
              <Button type="submit" className="w-full">
                Update
              </Button>
            </div>
          </form>
        </div>
      </Modal>
      <header>
        <div className="w-full absolute z-10 top-0">
          <nav className="lg:max-w-screen-lg max-w-3/4 mx-auto flex lg:flex-row flex-col-reverse justify-between items-center pt-20">
            <Link href="/">
              <a className="text-orange-light text-2xl tracking-widest font-bold">Keepify</a>
            </Link>
            <ul className="lg:flex flex-row hidden">
              <li>
                {userInfo.role === '1' ? (
                  <Link href="/dropzones">
                    <a className="text-white text-xl tracking-wider pl-8 hover:text-orange-light transition">
                      Dropzones
                    </a>
                  </Link>
                ) : (
                  <a
                    className="text-white text-xl tracking-wider pl-8 hover:text-orange-light transition"
                    href="https://k1mkuyv4azb.typeform.com/to/SLNsiRUn"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Become a Host
                  </a>
                )}
              </li>
              <li>
                <Link href={`/?logout=${+new Date()}`}>
                  <a className="text-white text-xl tracking-wider pl-8 hover:text-orange-light transition">
                    Logout
                  </a>
                </Link>
              </li>
            </ul>
            <div className="lg:hidden flex">
              <span className="cursor-pointer pb-6" onClick={() => setIsMenuOpen(true)}>
                <Menu size={36} color="#fff" />
              </span>
            </div>
          </nav>
        </div>
        <div className="w-full h-96 relative">
          <Image
            src="/profile/bg.jpg"
            alt="background"
            layout="fill"
            className="object-cover object-bottom"
          />
        </div>
      </header>
      <div className="relative w-full">
        <div className="lg:max-w-screen-lg max-w-3/4 mx-auto">
          <label
            htmlFor="profile-img"
            className="absolute w-32 h-32 -top-16 bg-orange-light bg-opacity-40 rounded-full flex justify-center items-center"
          >
            <motion.img
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
              className="w-24 h-24 rounded-full object-cover cursor-pointer"
              src={userInfo?.image_url ?? 'https://picsum.photos/600'}
              alt="profile-img"
            />
          </label>
          <input
            type="file"
            id="profile-img"
            accept="image/*"
            onChange={handleProfileImgChange}
            className="absolute p-0 hidden border-0"
            style={{ width: 1, height: 1, margin: -1, clip: 'rect(0, 0, 0, 0)' }}
          />
          <div className="pb-28 pt-32">
            <section className="pb-20">
              <div className="flex justify-between items-center pb-5">
                <h2 className="text-orange lg:text-2xl text-xl tracking-widest">
                  Personal Information
                </h2>
                <a
                  className="flex items-center cursor-pointer"
                  onClick={() => setIsModalOpen(true)}
                >
                  <Edit2 size={18} color="#FF8E6E" />
                  <p className="text-orange text-lg pl-4 tracking-wide cursor-pointer lg:block hidden">
                    Edit
                  </p>
                </a>
              </div>

              <span style={{ height: 1 }} className="flex mb-8 w-24 bg-purple bg-opacity-30" />

              <div className="flex flex-wrap -mx-4">
                <div className="m-4 lg:w-1/4 w-full">
                  <div className="flex flex-col">
                    <label className="text-purple">First Name</label>
                    <p className="text-xl">{userInfo.fname}</p>
                  </div>
                </div>
                <div className="m-4 lg:w-1/4 w-full">
                  <div className="flex flex-col">
                    <label className="text-purple">Last Name</label>
                    <p className="text-xl">{userInfo.lname}</p>
                  </div>
                </div>
                <div className="m-4 lg:w-1/4 w-full">
                  <div className="flex flex-col">
                    <label className="text-purple">Email Address</label>
                    <p className="text-xl">{userInfo.email}</p>
                  </div>
                </div>
                {/* <div className="flex flex-col">
                  <label className="text-purple">Phone Number</label>
                  <p className="text-xl">+90 5398429778</p>
                </div> */}
              </div>
            </section>
            {userInfo.role === '1' && currentTransactions?.length && (
              <section className="pb-20">
                <div className="flex justify-between items-center pb-5">
                  <h2 className="text-orange lg:text-2xl text-xl  tracking-widest">
                    Current Transactions
                  </h2>
                </div>

                <span style={{ height: 1 }} className="flex mb-8 w-24 bg-purple bg-opacity-30" />

                <div className="container mx-auto">
                  <div className="flex flex-wrap -mx-1 lg:-mx-4">
                    {currentTransactions.map((transaction, i) => (
                      <ProfileCard
                        key={i}
                        href={`/order/${transaction.id}`}
                        label={
                          moment(transaction.reservation_start).format('YYYY.MM.DD') +
                          ' - ' +
                          moment(transaction.reservation_end).format('YYYY.MM.DD')
                        }
                        img={transaction.dropzone.thumbnail}
                        header={transaction.dropzone.name}
                        tagText={transaction.status}
                        tagColor={tagColor[transaction.status]}
                      />
                    ))}
                  </div>
                </div>
              </section>
            )}
            <section className="pb-20">
              <div className="flex justify-between items-center pb-5">
                <h2 className="text-orange lg:text-2xl text-xl  tracking-widest">Past Keeps</h2>
              </div>

              <span style={{ height: 1 }} className="flex mb-8 w-24 bg-purple bg-opacity-30" />

              <div className="container mx-auto">
                <div className="flex flex-wrap -mx-1 lg:-mx-4">
                  {transactions.length ? (
                    transactions.map((transaction, i) => (
                      <ProfileCard
                        key={i}
                        href={`/order/${transaction.id}`}
                        label={
                          moment(transaction.reservation_start).format('YYYY.MM.DD') +
                          ' - ' +
                          moment(transaction.reservation_end).format('YYYY.MM.DD')
                        }
                        img={transaction.dropzone.thumbnail}
                        header={transaction.dropzone.name}
                        tagText={transaction.status}
                        tagColor={tagColor[transaction.status]}
                      />
                    ))
                  ) : (
                    <div className="w-full p-12 shadow-2xl rounded-xl flex flex-col items-center justify-center">
                      <span className="w-32">
                        <Image src="/profile/empty.svg" alt="empty" width={350} height={350} />
                      </span>
                      <h3 className="text-purple text-lg pt-4 pb-2">No past orders yet!</h3>
                      <p>
                        <Link href="/dropzones">
                          <a className="text-orange">Check out the available places now</a>
                        </Link>
                        and keep your first item!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </section>
            {userInfo.role === '1' && (
              <section>
                <div className="flex justify-between items-center pb-5">
                  <h2 className="text-orange lg:text-2xl text-xl  tracking-widest">My Storages</h2>
                  <a
                    className="flex items-center"
                    href="https://k1mkuyv4azb.typeform.com/to/SLNsiRUn"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <PlusCircle size={18} color="#FF8E6E" />
                    <p className="text-orange text-lg pl-4 tracking-wide  lg:block hidden">
                      Apply New Storage
                    </p>
                  </a>
                </div>

                <span style={{ height: 1 }} className="flex mb-8 w-24 bg-purple bg-opacity-30" />

                <div className="container mx-auto">
                  <div className="flex flex-wrap -mx-1 lg:-mx-4">
                    {dropzones?.length
                      ? dropzones.map((dropzone, i) => (
                          <ProfileCard
                            key={i}
                            href={`/dropzone/${dropzone.id}`}
                            label={`$${dropzone.rate}/${dropzone.unit}`}
                            img={dropzone.thumbnail}
                            header={dropzone.name}
                            tagText="Open"
                          />
                        ))
                      : null}
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

type Props = {
  currentTransactions?: Transaction[];
  transactions: Transaction[];
  dropzones?: DropzoneListItem[];
};

Profile.getInitialProps = async (ctx: PageContext) => {
  const cookies = nextCookie(ctx);
  try {
    if (cookies['_ap.ut']) {
      // set JWT token to axios header
      setAuthToken(cookies['_ap.ut']);
    }
    const { isLogin, userInfo } = ctx.store.getState().user;
    if (!isLogin) {
      throw new Error('Not logged in');
    }

    const transactions = await getTransactions();

    // if the user is a host, get dropzones
    if (userInfo.role === '1') {
      const dropzones = await getAllDropzones();
      const currentTransactions = await getTransactions({ status: 'CREATED' });

      return {
        transactions,
        dropzones,
        currentTransactions,
      };
    }

    return {
      transactions,
    };
  } catch (e) {
    console.log(e);
    // redirect(ctx.res, '/');
  }
};

export default Profile;
