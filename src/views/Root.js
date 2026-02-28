import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import CartProvider from '../context/CartContext';
import MainTemplate from '../templates/MainTemplate';
import { fire } from '../firebase/Firebase';
import Loader from '../components/atoms/Loader/Loader';
import ErrorBoundary from '../components/organisms/ErrorBoundary';

import AdminRoute from '../components/AdminRoute';
import NurseryProvider from '../context/NurseryContext';

const Home = lazy(() => import('./Home'));
const AllPlants = lazy(() => import('./AllPlants'));
const SinglePlant = lazy(() => import('./SinglePlant'));
const Login = lazy(() => import('./Login'));
const Checkout = lazy(() => import('./Checkout'));
const NurseryRegister = lazy(() => import('./NurseryRegister'));
const AdminLogin = lazy(() => import('./AdminLogin'));
const NurseryLogin = lazy(() => import('./NurseryLogin'));
const OrderSuccess = lazy(() => import('./OrderSuccess'));
const Feedback = lazy(() => import('./Feedback'));
const Contact = lazy(() => import('./Contact'));

// Lazy load admin pages
const Admin = lazy(() => import('./Admin'));
const NurseryList = lazy(() => import('./admin/NurseryList'));
const AddPlant = lazy(() => import('./admin/AddPlant'));
const PlantManagement = lazy(() => import('./admin/PlantManagement'));
const NurseryDashboard = lazy(() => import('./admin/NurseryDashboard'));
const FeedbackList = lazy(() => import('./admin/FeedbackList'));
const ContactList = lazy(() => import('./admin/ContactList'));
const Account = lazy(() => import('./Account'));

class Root extends React.Component {
  state = {
    user: null,
    authLoading: !!localStorage.getItem('auth_token'),
  };

  componentDidMount = () => {
    // BYPASS MODE: Set to true to skip authentication
    const BYPASS_AUTH = false;

    if (BYPASS_AUTH) {
      // Create a mock user to bypass login
      const mockUser = {
        uid: 'demo-user-123',
        email: 'demo@plantshop.com',
        displayName: 'Demo User',
      };
      this.setState({ user: mockUser, authLoading: false });
      localStorage.setItem('user', mockUser.uid);
      console.log('🌱 Authentication bypassed - using demo user');
    } else {
      this.authListener();
    }
  };

  authListener = () => {
    fire.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({ user, authLoading: false });
        localStorage.setItem('user', user.uid);
      } else {
        const stillLoading = !!localStorage.getItem('auth_token');
        this.setState({ user: null, authLoading: stillLoading });
        if (!stillLoading) {
          localStorage.removeItem('user');
        }
      }
    });
  };

  render() {
    const { user, authLoading } = this.state;

    if (authLoading) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Loader />
        </div>
      );
    }
    return (
      <NurseryProvider>
        <CartProvider user={user}>
          <BrowserRouter>
            <MainTemplate>
              <div>
                <Switch>
                  <Suspense fallback={<Loader />}>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/plants" component={AllPlants} />
                    <Route exact path="/plants/:slug" component={SinglePlant} />
                    <Route exact path="/nursery-register" component={NurseryRegister} />
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/nursery-login" component={NurseryLogin} />
                    <Route exact path="/feedback" component={Feedback} />
                    <Route exact path="/contact" component={Contact} />
                    <Route exact path="/admin-login" component={AdminLogin} />

                    {/* Protected Routes */}
                    <Route
                      exact
                      path="/checkout"
                      render={() => (user ? <Checkout /> : <Login />)}
                    />
                    <Route exact path="/account" render={() => (user ? <Account /> : <Login />)} />
                    <Route
                      exact
                      path="/success"
                      render={() => (user ? <OrderSuccess /> : <Login />)}
                    />

                    {/* Admin Routes */}
                    <AdminRoute exact path="/admin" component={Admin} user={user} />
                    <AdminRoute exact path="/admin/nurseries" component={NurseryList} user={user} />
                    <AdminRoute
                      exact
                      path="/admin/plants"
                      component={PlantManagement}
                      user={user}
                    />
                    <AdminRoute exact path="/admin/feedback" component={FeedbackList} user={user} />
                    <AdminRoute exact path="/admin/contact" component={ContactList} user={user} />

                    {/* Nursery Routes - temporarily using AdminRoute, should use NurseryRoute */}
                    <AdminRoute exact path="/nursery" component={NurseryDashboard} user={user} />
                    <AdminRoute exact path="/nursery/add-plant" component={AddPlant} user={user} />
                  </Suspense>
                </Switch>
              </div>
            </MainTemplate>
          </BrowserRouter>
        </CartProvider>
      </NurseryProvider>
    );
  }
}

export default function ErrorBoundaryFunc(props) {
  return (
    <ErrorBoundary>
      <Root {...props} />
    </ErrorBoundary>
  );
}
