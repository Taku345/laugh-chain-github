import { rgb } from 'pdf-lib'

const $mm2pt = 2.8346

export const pt2mm = (pt) =>
{
	return pt / $mm2pt;
}

export const mm2pt = (mm) =>
{
	return mm * $mm2pt;
}


export const hex2rgb = (hex: string) =>
{
	if (hex.slice(0, 1) === '#') hex = hex.slice(1);
	if (hex.length === 3)
	hex =
		hex.slice(0, 1) +
		hex.slice(0, 1) +
		hex.slice(1, 2) +
		hex.slice(1, 2) +
		hex.slice(2, 3) +
		hex.slice(2, 3);

	return [hex.slice(0, 2), hex.slice(2, 4), hex.slice(4, 6)].map((str) => parseInt(str, 16));
}

export const hex2RgbColor = (hexString: string | undefined) =>
{
	if (hexString) {
	const [r, g, b] = hex2rgb(hexString);

	return rgb(r / 255, g / 255, b / 255);
	}

	return rgb(0, 0, 0);
};