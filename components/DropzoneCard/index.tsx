import { calculateDistance, formatDistance } from 'helpers/geo';
import { memo } from 'react';
import Skeleton from 'react-loading-skeleton';
import { LatLng } from 'types';
import { DropzoneListItem } from 'types/dropzone';

type Props = DropzoneListItem & {
  onHover: () => void;
  currentLocation?: LatLng;
};

const DropzoneCard = (props: Props) => (
  <div className="my-1 px-1 w-full md:w-1/2 lg:my-4 lg:px-4 lg:w-1/3" onMouseEnter={props.onHover}>
    <article className="overflow-hidden rounded-lg shadow-lg">
      <a href="#">
        <img alt="Placeholder" className="block h-auto w-full" src={props.photo_urls[0]} />
      </a>
      <header className="flex items-center justify-between leading-tight p-2 md:p-4">
        <h1 className="text-lg">
          <a className="no-underline hover:underline text-black" href="#">
            {props.location_name}
          </a>
        </h1>
        <p className="text-grey-darker text-sm text-right">
          {props.cost.currency}
          {props.cost.rate}/{props.cost.unit}
        </p>
      </header>
      <footer className="flex items-center justify-between leading-none p-2 md:p-4">
        <a className="flex items-center no-underline hover:underline text-black" href="#">
          <img alt="Placeholder" className="block rounded-full" src={props.host.photo} />
          <p className="ml-2 text-sm">
            {props.host.first_name} {props.host.last_name}
          </p>
        </a>
        <p className="text-grey-darker text-sm text-right">
          {props.currentLocation &&
            formatDistance(calculateDistance(props.currentLocation, props.location))}
        </p>
      </footer>
    </article>
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
