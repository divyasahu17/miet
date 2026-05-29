"use client";
import React from 'react';
import Image from 'next/image';
import { FaThLarge, FaList, FaTags, FaUserCircle, FaSignOutAlt, FaChevronLeft, FaChevronRight, FaUserMd, FaChevronDown, FaSearch, FaEdit, FaTrash, FaPlus, FaEye, FaImages, FaCog } from "react-icons/fa";
import Select from "react-select";

export default function OrdersTab(props: any) {
  const {
    DataTable,
    orders = []
  } = props;

  return (
    <>


            <section>

            <h2>Orders</h2>

            <DataTable
            data={orders}

            columns={[

            { key:'order_id', label:'Order ID' },

            {
            key:'customer',
            label:'Customer',
            render:(v: any,row: { first_name?: string; last_name?: string; email?: string })=>(
            <div>
            {row.first_name} {row.last_name}
            <br/>
            {row.email}
            </div>
            )
            },

            { key:'product_name', label:'Product' },

            { key:'price', label:'Price' },

            { key:'quantity', label:'Quantity' },

            { key:'total', label:'Total' },

            { key:'payment_status', label:'Payment Status' },

            {
            key:'created_at',
            label:'Date',
            render:(v: string)=> new Date(v).toLocaleString()
            }

            ]}
            />

            </section>

            
    </>
  );
}
