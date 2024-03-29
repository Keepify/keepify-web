import { memo } from 'react';
import { motion } from 'framer-motion';

type Props = {
  label: string;
  img: string;
  header: string;
  tagText: string;
  tagColor?: string;
  href?: string;
};

const ProfileCard: React.FC<Props> = (props) => (
  <motion.a
    whileHover={{ translateY: -5 }}
    transition={{ duration: 0.3 }}
    className="my-1 px-1 w-full md:w-1/2 lg:my-4 lg:px-4 lg:w-1/3 h-48 cursor-pointer"
    href={props.href ?? '#'}
    target="_blank"
    rel="noreferrer"
  >
    <article
      className="overflow-hidden rounded-lg shadow-lg relative w-full h-full"
      style={{ background: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.55))' }}
    >
      <img
        className="lg:w-80 w-full h-48 object-cover absolute"
        style={{ zIndex: -1 }}
        src={props.img}
        alt="transaction-img"
      />
      <p className="text-white absolute top-3 right-4 tracking-wider text-sm">{props.label}</p>
      <footer className="absolute px-4 bottom-3 flex flex-col">
        <h5 className="tracking-widest mb-3 text-white">{props.header}</h5>
        <span
          className={`${props.tagColor} text-xs text-white w-24 py-1 mr-2 rounded-lg flex justify-center items-center`}
        >
          {props.tagText}
        </span>
      </footer>
    </article>
  </motion.a>
);

ProfileCard.defaultProps = {
  tagColor: 'bg-orange',
};

export default memo(ProfileCard);
