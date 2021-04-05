import { calculateDistance, formatDistance } from 'helpers/geo';
import { memo } from 'react';
import Skeleton from 'react-loading-skeleton';
import { LatLng } from 'types';
import { DropzoneListItem } from 'types/dropzone';
import Link from 'next/link';
import { User } from 'react-feather';

type Props = DropzoneListItem & {
  onHover: () => void;
  currentLocation?: LatLng;
};

const DropzoneCard = (props: Props) => (
  <div className="my-1 px-1 w-full md:w-1/2 lg:my-4 lg:px-4 lg:w-1/3">
    <Link href={`/dropzone/${props.id}`}>
      <a>
        <article className="overflow-hidden rounded-lg shadow-lg">
          <img alt="Placeholder" className="block h-40 w-full object-cover" src={props.thumbnail} />
          <header className="flex items-center justify-between leading-tight p-2 md:p-4">
            <h1 className="text-lg">
              <span className="no-underline text-black">{props.name}</span>
            </h1>
            <p className="text-grey-darker text-sm text-right">${props.rate}/day</p>
          </header>
          <footer className="flex items-center justify-between leading-none p-2 md:p-4">
            <span className="flex items-center no-underline text-black">
              <span className="flex justify-center items-center rounded-full bg-purple w-7 h-7">
                <User color="#FF8E6E" size={14} />
              </span>
              <p className="ml-2 text-sm">
                {props.host.fname} {props.host.lname}
              </p>
            </span>
            <p className="text-grey-darker text-sm text-right">
              {props.currentLocation &&
                formatDistance(
                  calculateDistance(props.currentLocation, {
                    latitude: props.location.lat,
                    longitude: props.location.lng,
                  })
                )}
            </p>
          </footer>
        </article>
      </a>
    </Link>
  </div>
);

export const SkeletonCard = memo(() => (
  <div className="my-1 px-1 w-full md:w-1/2 lg:my-4 lg:px-4 lg:w-1/3">
    <article className="overflow-hidden rounded-lg shadow-lg">
      <a href="#">
        <Skeleton height={150} width="100%" />
      </a>
      <header className="flex items-center justify-between leading-tight p-2 md:p-4">
        <h1 className="w-full">
          <Skeleton height={30} />
        </h1>
      </header>
      <footer className="flex items-center justify-between leading-none p-2 md:p-4">
        <a className="flex items-center no-underline hover:underline text-black" href="#">
          <Skeleton circle={true} height={32} width={32} />
          <p className="ml-2">
            <Skeleton height={25} width={125} />
          </p>
        </a>
      </footer>
    </article>
  </div>
));

export default memo(DropzoneCard);
