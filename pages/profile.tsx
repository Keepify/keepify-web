import { redirect } from 'middlewares/redirect';
import { NextPage } from 'next';
import { PageContext } from 'types';
import Link from 'next/link';
import Image from 'next/image';
import { Edit2 } from 'react-feather';
import ProfileCard from 'components/ProfileCard';

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

const Profile: NextPage<Props> = () => {
  return (
    <div className="relative">
      <header>
        <div className="w-full absolute z-10 top-0">
          <nav className="max-w-screen-lg mx-auto flex justify-between items-center pt-20">
            <Link href="/">
              <a className="text-orange-light text-2xl tracking-widest font-bold">Keepify</a>
            </Link>
            <ul className="flex flex-row">
              <li>
                <a className="text-white text-xl tracking-wider pl-8 hover:text-orange-light transition">
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
            <img
              className="w-24 h-24 rounded-full object-cover"
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
                  <p className="text-orange text-lg pl-4 tracking-wide">Edit</p>
                </a>
              </div>

              <span style={{ height: 1 }} className="flex mb-8 w-24 bg-purple bg-opacity-30" />

              <div className="flex justify-between">
                <div className="flex flex-col">
                  <label className="text-purple">First Name</label>
                  <p className="text-xl">Mark</p>
                </div>
                <div className="flex flex-col">
                  <label className="text-purple">Last Name</label>
                  <p className="text-xl">Zuck</p>
                </div>
                <div className="flex flex-col">
                  <label className="text-purple">Email Address</label>
                  <p className="text-xl">mark@facebook.com</p>
                </div>
                <div className="flex flex-col">
                  <label className="text-purple">Phone Number</label>
                  <p className="text-xl">+90 5398429778</p>
                </div>
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
