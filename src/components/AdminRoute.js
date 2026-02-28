import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

const AdminRoute = ({ component: Component, user, ...rest }) => {
    // Check if user is logged in AND is an admin (or nursery for those routes)
    // For now, we allow both 'admin' and 'nursery' roles to access AdminRoute protected pages,
    // or we can refine it.

    // Fallback to localStorage if user prop isn't ready (though Root handles this)
    const isAuth = user && (user.role === 'admin' || user.role === 'nursery');

    // Debugging
    console.log('AdminRoute check:', { user, isAuth });

    return (
        <Route
            {...rest}
            render={(props) =>
                isAuth ? (
                    <Component {...props} />
                ) : (
                    <Redirect to={{ pathname: '/', state: { from: props.location } }} />
                )
            }
        />
    );
};

AdminRoute.propTypes = {
    component: PropTypes.any.isRequired,
    location: PropTypes.object,
};

export default AdminRoute;
