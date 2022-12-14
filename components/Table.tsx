import { CheckIcon, XMarkIcon } from "@heroicons/react/20/solid"
import { Product } from "@stripe/firestore-stripe-payments"
import React from 'react'

interface Props {
    products: Product[],
    selectedPlan: Product | null
}

function Table({ products, selectedPlan }: Props) {
  return (
    <table>
        <tbody className="divide-y divide-[gray]">
            <tr className="table-row1">
                <td className="table-data-title">Monthly Price</td>
                {products.map((product) => (
                    <td key={product.id} className={`table-data ${product.id === selectedPlan?.id ? "text-[#e30914]" : "text-[gray]"}`}>${product.prices[0].unit_amount! / 100}.00</td>
                ))}
            </tr>

            <tr className="table-row1">
                <td className="table-data-title">Video Quality</td>
                {products.map((product) => (
                    <td key={product.id} className={`table-data ${product.id === selectedPlan?.id ? "text-[#e30914]" : "text-[gray]"}`}>{product.metadata.videoQuality}</td>
                ))}
            </tr>

            <tr className="table-row1">
                <td className="table-data-title">Resolution</td>
                {products.map((product) => (
                    <td key={product.id} className={`table-data ${product.id === selectedPlan?.id ? "text-[#e30914]" : "text-[gray]"}`}>{product.metadata.resolution}</td>
                ))}
            </tr>

            <tr className="table-row1">
                <td className="table-data-title">Portability</td>
                {products.map((product) => (
                    <td key={product.id} className={`table-data ${product.id === selectedPlan?.id ? "text-[#e30914]" : "text-[gray]"}`}>
                        {product.metadata.portability ? <CheckIcon className="inline-block w-8 h-8" /> : <XMarkIcon />}
                    </td>
                ))}
            </tr>
        </tbody>
    </table>
  )
}

export default Table