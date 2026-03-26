import React from 'react';

const jestEmptyComponent = function (
    props: React.HTMLAttributes<HTMLDivElement>,
) {
    return <div {...props} />;
};

export default jestEmptyComponent;
