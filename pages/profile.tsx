import { redirect } from 'middlewares/redirect';
import { NextPage } from 'next';
import { PageContext } from 'types';
import Link from 'next/link';
import Image from 'next/image';
import { Edit2 } from 'react-feather';
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
import { updateUserInfo } from 'actions/user';
import { errorNotification } from 'helpers/notification';
import { emailPattern } from 'helpers/validation';
import { updateUser } from 'services/user';
import { getTransactions } from 'services/transactions';

const mockTransaction = {
  cost: 50.0,
  creation_time: 'Fri, 05 Nov 2021 00:00:00 GMT',
  dropzone: {
    host: {
      email: 'a@mail.com',
      fname: 'Mark',
      id: '65c141ee-1fde-b269-d2e3-93cb1d3e1c09',
      lname: 'ZUCK',
      role: 'HOST',
    },
    id: '269638b9-0611-49e9-228d-1b2718cb035e',
    location: {
      lat: -73.878993913,
      lng: 40.721959482,
    },
    name: 'bilkent',
    rate: null,
    rating: null,
    services: null,
    thumbnail: null,
    type: null,
    unit: null,
  },
  id: '020bce01-ba6a-6623-702c-4da1bc6d556e',
  reservation_end: null,
  reservation_start: null,
  status: 'COMPLETED',
  user: {
    email: 'user@mail.com',
    fname: 'Bill',
    id: '65c141ee-1fde-b269-d2e3-93cb1d3e1c09',
    lname: 'Gates',
    role: 'USER',
  },
};

type EditProfileFields = {
  firstName: string;
  lastName: string;
  email: string;
};

const Profile: NextPage<Props> = () => {
  const { userInfo } = useUserInfo();
  const { register, handleSubmit, errors, setValue } = useForm<EditProfileFields>();
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useFormError(errors);

  useEffect(() => {
    // load state data into modal form
    if (isModalOpen) {
      setValue('email', userInfo.email);
      setValue('firstName', userInfo.fname);
      setValue('lastName', userInfo.lname);
    }
  }, [isModalOpen]);

  useEffect(() => {
    (async () => {
      // const data = await getTransactions();
      // console.log({ data });
    })();
  }, []);

  async function onUpdateProfile(data: EditProfileFields) {
    try {
      setIsLoading(true);

      const payload = {
        fname: data.firstName,
        lname: data.lastName,
        email: data.email,
      };

      const result = await updateUser(payload);
      console.log({ result });

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

  return (
    <div className="relative">
      {isLoading && <Loader />}
      <Modal isOpen={isModalOpen}>
        <div className="bg-silver shadow-2xl rounded-xl max-w-3/4 w-160 p-8 relative flex overflow-hidden">
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
          <nav className="max-w-screen-lg mx-auto flex justify-between items-center pt-20">
            <Link href="/">
              <a className="text-orange-light text-2xl tracking-widest font-bold">Keepify</a>
            </Link>
            <ul className="flex flex-row">
              <li>
                <a
                  className="text-white text-xl tracking-wider pl-8 hover:text-orange-light transition"
                  href="https://k1mkuyv4azb.typeform.com/to/SLNsiRUn"
                  target="_blank"
                  rel="noreferrer"
                >
                  Become a Host
                </a>
              </li>
              <li>
                <a className="text-white text-xl tracking-wider pl-8 hover:text-orange-light transition">
                  Logout
                </a>
              </li>
            </ul>
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
        <div className="max-w-screen-lg mx-auto">
          <div className="absolute w-32 h-32 -top-16 bg-orange-light bg-opacity-40 rounded-full flex justify-center items-center">
            <motion.img
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
              className="w-24 h-24 rounded-full object-cover cursor-pointer"
              src="https://picsum.photos/600"
              alt="profile-img"
            />
          </div>
          <div className="pb-28 pt-32">
            <section className="pb-20">
              <div className="flex justify-between items-center pb-5">
                <h2 className="text-orange text-2xl tracking-widest">Personal Information</h2>
                <a className="flex items-center cursor-pointer">
                  <Edit2 size={18} color="#FF8E6E" />
                  <p
                    className="text-orange text-lg pl-4 tracking-wide cursor-pointer"
                    onClick={() => setIsModalOpen(true)}
                  >
                    Edit
                  </p>
                </a>
              </div>

              <span style={{ height: 1 }} className="flex mb-8 w-24 bg-purple bg-opacity-30" />

              <div className="flex flex-wrap -mx-4">
                <div className="mx-4 my-4 w-1/4">
                  <div className="flex flex-col">
                    <label className="text-purple">First Name</label>
                    <p className="text-xl">{userInfo.fname}</p>
                  </div>
                </div>
                <div className="my-4 w-1/4">
                  <div className="flex flex-col">
                    <label className="text-purple">Last Name</label>
                    <p className="text-xl">{userInfo.lname}</p>
                  </div>
                </div>
                <div className="my-4 w-1/4">
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

            <section>
              <div className="flex justify-between items-center pb-5">
                <h2 className="text-orange text-2xl tracking-widest">Past Keeps</h2>
              </div>

              <span style={{ height: 1 }} className="flex mb-8 w-24 bg-purple bg-opacity-30" />

              <div className="container mx-auto">
                <div className="flex flex-wrap -mx-1 lg:-mx-4">
                  <ProfileCard
                    label="2021.02.02 - 2021.02.05"
                    img="https://picsum.photos/920/580"
                    header="Bilkent Dorm 77"
                    tagText="Confirmed"
                  />
                  <ProfileCard
                    label="2021.02.02 - 2021.02.05"
                    img="https://picsum.photos/920/580"
                    header="Bilkent Dorm 77"
                    tagText="Confirmed"
                  />
                  <ProfileCard
                    label="2021.02.02 - 2021.02.05"
                    img="https://picsum.photos/920/580"
                    header="Bilkent Dorm 77"
                    tagText="Confirmed"
                  />
                </div>
              </div>

              {/* <div className="w-full p-12 shadow-2xl rounded-xl flex flex-col items-center justify-center">
                <span className="w-32">
                  <Image src="/profile/empty.svg" alt="empty" width={350} height={350} />
                </span>
                <h3 className="text-purple text-lg pt-4 pb-2">No past orders yet!</h3>
                <p>
                  <Link href="/dropzones">
                    <a className="text-orange">Check out the available places now</a>
                  </Link>{' '}
                  and keep your first item!
                </p>
              </div> */}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

type Props = {};

Profile.getInitialProps = async (ctx: PageContext) => {
  try {
    // const { isLogin } = ctx.store.getState().user;
    // if (!isLogin) {
    //   throw new Error('Not logged in');
    // }
  } catch (e) {
    redirect(ctx.res, '/');
  }
};

export default Profile;
