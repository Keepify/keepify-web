import React from 'react';

// Override React.memo with our own typings
const memo: <T>(c: T) => T = React.memo;

export default memo;
