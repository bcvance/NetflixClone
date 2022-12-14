import { BellIcon, MagnifyingGlassIcon } from "@heroicons/react/20/solid"
import { getProducts, Product } from "@stripe/firestore-stripe-payments";
import { GetStaticProps } from "next";
import Head from "next/head"
import Link from "next/link"
import React, { useState } from 'react'
import Membership from "../components/Membership";
import useAuth from "../hooks/useAuth";
import useSubscription from "../hooks/useSubscription";
import payments from "../lib/stripe";

interface Props {
    products: Product[]
}

function Account({ products }: Props) {
    const [isScrolled, setIsScrolled] = useState(false);
    const { user, logOut } = useAuth();
    const subscription = useSubscription(user);

  return (
    <div>
        <Head>
            <title>Netflix - Account Settings</title>
            <link rel="icon" href="favicon.ico" />
        </Head>

        <header className={`${isScrolled && "bg-[#141414]"}`}>
        <div className="flex items-center space-x-2 md:space-x-10">
            <img 
                src="https://rb.gy/ulxxee"
                width={100}
                height={100}
                className="cursor-pointer object-contain" 
            />

            <ul className="hidden space-x-4 md:flex">
                <li className="header-link">Home</li>
                <li className="header-link">TV Shows</li>
                <li className="header-link">Movies</li>
                <li className="header-link">New & Popular</li>
                <li className="header-link">My List</li>
            </ul>
        </div>

        <div className="flex items-center space-x-4 text-sm font-light">
            <MagnifyingGlassIcon className="hidden h-6 w-6 sm:inline" />
            <p className="hidden lg:inline">Kids</p>
            <BellIcon className="h-6 w-6" />
            <Link href="/account">
                <img src="https://rb.gy/g1pwyx"
                alt=""
                className="cursor-pointer rounded"
                />
            </Link>
        </div>
    </header>

    <main className="mx-auto max-w-6xl pt-24 px-5 pb-12 transition-all md:mx-10">
        <div className="flex flex-col gap-x-4 md:flex-row md:items-center">
            <h1 className="text-3xl md:text-4xl">Account</h1>
            <div className="-ml-0.5 flex items-center gap-x-1.5">
                <img src="https://rb.gy/4vfk4r" alt="" className="h-7 w-7" />
                {/* <p>Member since {subscription?.created.slice(4, 16)}</p> */}
                <p className="text-xs font-semibold text-[#555]">Member since {subscription?.created}</p>
            </div>
        </div>

        <Membership />

        <div className="mt-6 grid grid-cols-1 gap-x-4 border px-4 py-4 md:grid-cols-4 md:border-x-0 md:border-t md:border-b-0 md:px-0 md:pb-0">
            <h4>Plan Details</h4>
            {/* Find the current plan */}
            <div className="col-span-2 font-medium">
                {products.filter((product) => product.id === subscription?.product)[0]?.name}
            </div>
            <p className="cursor-pointer text-blue-500 hover:underline md:text-right">Change Plan</p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-x-4 border px-4 py-4 md:grid-cols-4 md:border-x-0 md:border-t md:border-b-0 md:px-0 md:pb-0">
            <h4>Settings</h4>
            <p
                className="col-span-3 cursor-pointer text-blue-500 hover:underline"
                onClick={logOut}
            >
            Sign out of all devices
          </p>
        </div>
    </main>
    </div>
  )
}

export default Account


export const getStaticProps: GetStaticProps = async () => {
    const products = await getProducts(payments, {
        includePrices: true,
        activeOnly: true,
    })
    .then((res) => res)
    .catch((error) => console.log(error.message))

    return {
        props: {
            products,
        }
    }
}