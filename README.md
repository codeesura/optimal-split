# Optimal DEX Arbitrage Calculator

This project demonstrates how to calculate the optimal way to split a trade across multiple decentralized exchanges (DEXs) to maximize returns. It uses mathematical optimization techniques to find the best trade allocation.

## Problem Statement

We have two different DEXs with different liquidity pools:

- **DEX-A**: 200,150 USDC and 100 ETH (1 WETH = 2001.5 USDC)
- **DEX-B**: 500,000 USDC and 250 ETH (1 WETH = 2000 USDC)

The goal is to sell 1 WETH to get the maximum possible amount of USDC. While it might seem intuitive to sell all WETH on DEX-A (which has a higher unit price), the optimal solution requires a mathematical approach due to the constant product AMM (Automated Market Maker) model used by DEXs.

## Mathematical Background

DEXs typically use a constant product AMM principle, expressed as:

$$x \times y = k$$

Where:
- $x$: Amount of WETH in the pool
- $y$: Amount of USDC in the pool
- $k$: Constant value (liquidity constant)

When selling WETH, the amount of USDC received is calculated as:

$$\text{USDC received} = y - \frac{k}{x + \text{added WETH}}$$

## Optimal Split Calculation

To maximize the total USDC received, we need to find the optimal way to split our 1 WETH between the two DEXs. The total output function is:

$$F(w) = \left(y_A - \frac{k_A}{x_A + w}\right) + \left(y_B - \frac{k_B}{x_B + (1 - w)}\right)$$

Where:
- $w$: Amount of WETH to send to DEX-A
- $1-w$: Amount of WETH to send to DEX-B

## Finding the Maximum Point

To find the maximum point, we take the derivative of the function and set it to zero:

$$\frac{dF}{dw} = \frac{k_A}{(x_A + w)^2} - \frac{k_B}{(x_B + (1 - w))^2} = 0$$

This project uses a binary search algorithm to find this optimal point numerically.

## Installation

To install dependencies:

```bash
bun install
```

## Running the Project

To run the calculation:

```bash
bun run index.ts
```

## Results

The code calculates:

1. The optimal split of 1 WETH between DEX-A and DEX-B
2. The total USDC output from this optimal trade

## Summary

- Due to the constant product AMM model, the price in each DEX changes with each trade
- The optimal solution is to split the 1 WETH between both DEXs rather than trading on a single DEX
- The binary search algorithm finds the exact split that maximizes the total USDC received

This project demonstrates the concept of "Optimal trade" in DeFi, the principles of liquidity pools, and how calculus (derivatives) can be used to determine maximum profit in trading scenarios.

## Technologies Used

- TypeScript
- ethers.js for handling cryptocurrency units
- Bun as the JavaScript runtime

This project was created using `bun init` in bun v1.2.4. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
