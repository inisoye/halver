import * as React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';
import { ISvgProps } from 'svg.types';

type BankEmojiProps = ISvgProps;

export const BankEmoji: React.FunctionComponent<BankEmojiProps> = ({ ...props }) => {
  return (
    <Svg
      fill="none"
      height={24}
      viewBox="0 0 24 24"
      width={24}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Rect fill="#fff" height={24} rx={4} width={24} />
      <Rect fill="#78A3AD" fillOpacity={0.6} height={24} rx={4} width={24} />
      <Path d="M4 3h16v18.086H4z" fill="#fff" />
      <Path d="M4 3h16v18.086H4z" fill="#78A3AD" fillOpacity={0.6} />
      <Path d="M5.244 4.056h13.855v5.159H5.244v-5.16Z" fill="#fff" />
      <Path d="M5.244 9.36h13.855v11.725H5.244V9.36Z" fill="#006CA2" />
      <Path
        d="M7.032 7.051c-.133 0-.247.008-.247.197 0 .092-.005.183.001.276a.35.35 0 0 0 .033.15c.026.045.057.045.099.05.054.009.1.01.157.01a.33.33 0 0 0 .306-.212.35.35 0 0 0-.01-.241.378.378 0 0 0-.34-.23Zm3.465-.23-.005-.02c-.026-.106-.05-.213-.075-.32-.019-.036-.032-.088-.08-.075-.032.008-.046.05-.054.073l-.01.012c-.023.147-.05.295-.077.442l-.003.016-.008.036a.314.314 0 0 0 .004.133l.035.043.056.019.039.014h.134c.164-.047.064-.247.048-.36l-.004-.014ZM6.92 6.207c.129.026.297-.019.372-.166a.332.332 0 0 0-.02-.334l-.024-.032c-.052-.059-.127-.075-.195-.078a.404.404 0 0 0-.21.034l-.03.036a.58.58 0 0 0 .001.46.152.152 0 0 0 .106.08Z"
        fill="#78A3AD"
      />
      <Path
        d="M18.668 3H5.335C4.6 3 4 3.6 4 4.335v16.75h5.766v-2.833c0-.409.333-.744.742-.744h2.983c.408 0 .743.335.743.744v2.834H20V4.335A1.335 1.335 0 0 0 18.668 3ZM7.87 15.834H5.99v-2.268h1.88v2.268Zm0-3.47H5.99v-2.267h1.88v2.268Zm.54-4.615c-.12.283-.332.527-.603.644-.32.139-.668.155-1.008.146-.194-.004-.457.01-.623-.108-.32-.23-.261-.55-.266-.903-.004-.315-.004-.63-.014-.943a16.97 16.97 0 0 1 .001-.858c.005-.21-.052-.487.093-.66.241-.292.7-.3 1.04-.273.553.043 1.233.316 1.16 1.051a.794.794 0 0 1-.102.312c-.057.096-.177.21-.12.341.064.149.26.23.35.374.108.176.159.348.162.51a.902.902 0 0 1-.07.367Zm2.825 8.085H9.356v-2.268h1.88v2.268Zm0-3.47H9.356v-2.267h1.88v2.268Zm.15-3.84c-.161.04-.479.008-.552-.166-.103-.242-.055-.524-.4-.569-.162-.021-.396.05-.464.21-.07.167-.015.374-.194.488-.121.078-.291.09-.432.066-.314-.05-.39-.283-.343-.572.023-.14.053-.28.09-.418.069-.282.155-.56.219-.842.066-.295.115-.593.196-.886.142-.521.4-1.209 1.088-.978.294.099.377.425.472.685.139.375.194.789.28 1.179.064.281.149.56.22.842.04.167.12.418.097.625-.018.159-.091.287-.278.336Zm3.216 7.31h-1.88v-2.268h1.88v2.268Zm0-3.47h-1.88v-2.267h1.88v2.268Zm.48-4.887a3.235 3.235 0 0 1-.028.374c-.028.204-.106.55-.358.574a.65.65 0 0 1-.245-.02c-.402-.119-.472-.554-.711-.851-.063-.077-.106-.158-.154-.24-.054-.094-.164-.279-.288-.295-.154-.02-.119.194-.117.3.004.317.11.995-.258 1.155-.544.238-.68-.501-.688-.84-.012-.421-.06-.843-.06-1.264 0-.33-.036-1.029.253-1.267.468-.386.748.019 1.046.364.136.159.224.322.338.497.068.104.247.216.302.049.092-.275-.005-.618.14-.873.177-.31.684-.228.817.083.025.056.032.151.04.216.077.672-.018 1.361-.03 2.038Zm2.886 8.357h-1.88v-2.268h1.88v2.268Zm0-3.47h-1.88v-2.267h1.88v2.268Zm.302-4.137c-.082.179-.317.357-.518.282-.228-.086-.343-.318-.43-.53-.082-.206-.18-.425-.367-.56-.096-.069-.175-.031-.24.041-.259.282.16.86-.27 1.049-.101.043-.247.039-.356.027-.524-.055-.414-.583-.417-.97-.003-.333-.003-.662-.014-.987-.01-.298-.005-.584.002-.868.002-.121.01-.222.025-.342.017-.152.004-.327.153-.426.139-.093.334-.07.485-.03.2.054.2.13.266.32.05.143.055.309.058.46.003.09.019.214.13.216.114 0 .21-.194.276-.269.062-.073.133-.14.17-.228.132-.298.556-.582.858-.302.261.241.06.578-.116.802-.16.205-.441.432-.339.723.124.359.389.669.54 1.017.048.107.117.254.132.392a.392.392 0 0 1-.028.183Z"
        fill="#78A3AD"
      />
    </Svg>
  );
};