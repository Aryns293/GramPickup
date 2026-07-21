import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const ROUTES = {
  '/customer/dashboard':    ['Dashboard'],
  '/customer/parcels':      ['Dashboard', 'My Parcels'],
  '/customer/add-parcel':   ['Dashboard', 'Add Parcel'],
  '/customer/shops':        ['Dashboard', 'Verified Shops'],
  '/customer/notifications':['Dashboard', 'Notifications'],
  '/customer/profile':      ['Dashboard', 'Profile'],

  '/shopkeeper/dashboard':       ['Dashboard'],
  '/shopkeeper/incoming':        ['Dashboard', 'Incoming Parcels'],
  '/shopkeeper/pending-pickups': ['Dashboard', 'Pending Pickups'],
  '/shopkeeper/revenue':         ['Dashboard', 'Revenue'],
  '/shopkeeper/notifications':   ['Dashboard', 'Notifications'],
  '/shopkeeper/profile':         ['Dashboard', 'Profile'],

  '/admin/dashboard':     ['Dashboard'],
  '/admin/shops':         ['Dashboard', 'Shops'],
  '/admin/users':         ['Dashboard', 'Users'],
  '/admin/parcels':       ['Dashboard', 'Parcels'],
  '/admin/analytics':     ['Dashboard', 'Analytics'],
  '/admin/notifications': ['Dashboard', 'Notifications'],
};

const dashboardLink = (pathname) => {
  if (pathname.startsWith('/customer'))   return '/customer/dashboard';
  if (pathname.startsWith('/shopkeeper')) return '/shopkeeper/dashboard';
  if (pathname.startsWith('/admin'))      return '/admin/dashboard';
  return '/';
};

const Breadcrumbs = () => {
  const { pathname } = useLocation();
  const crumbs = ROUTES[pathname];
  if (!crumbs || crumbs.length <= 1) return null;

  const home = dashboardLink(pathname);

  return (
    <nav className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 mb-6">
      <Link to={home} className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
        {crumbs[0]}
      </Link>
      {crumbs.slice(1).map((c, i) => (
        <React.Fragment key={i}>
          <span>/</span>
          <span className="text-gray-600 dark:text-gray-300 font-medium">{c}</span>
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
