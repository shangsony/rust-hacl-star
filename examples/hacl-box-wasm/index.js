const rust = import("./pkg/hacl_box_wasm");

const SK1 = [
    0x85, 0xd6, 0xbe, 0x78,
    0x57, 0x55, 0x6d, 0x33,
    0x7f, 0x44, 0x52, 0xfe,
    0x42, 0xd5, 0x06, 0xa8,
    0x01, 0x03, 0x80, 0x8a,
    0xfb, 0x0d, 0xb2, 0xfd,
    0x4a, 0xbf, 0xf6, 0xaf,
    0x41, 0x49, 0xf5, 0x1b
];

const SK2 = [
    0x85, 0xd6, 0xbe, 0x78,
    0x57, 0x55, 0x6d, 0x33,
    0x7f, 0x44, 0x52, 0xfe,
    0x42, 0xd5, 0x06, 0xa8,
    0x01, 0x03, 0x80, 0x8a,
    0xfb, 0x0d, 0xb2, 0xfd,
    0x4a, 0xbf, 0xf6, 0xaf,
    0x41, 0x49, 0xf5, 0x1c
];

const NONCE = [
    0x00, 0x01, 0x02, 0x03,
    0x04, 0x05, 0x06, 0x07,
    0x08, 0x09, 0x10, 0x11,
    0x12, 0x13, 0x14, 0x15,
    0x16, 0x17, 0x18, 0x19,
    0x20, 0x21, 0x22, 0x23,
];

const MSG = new Uint8Array([
    // 32 bytes zero.
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,

    0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07,
    0x08, 0x09, 0x10, 0x11, 0x12, 0x13, 0x14, 0x15,
    0x16, 0x17, 0x18, 0x19, 0x20, 0x21, 0x22, 0x23,
    0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07,
    0x08, 0x09, 0x10, 0x11, 0x12, 0x13, 0x14, 0x15,
    0x16, 0x17, 0x18, 0x19, 0x20, 0x21, 0x22, 0x23,
    0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07,
    0x08, 0x09, 0x10, 0x11, 0x12, 0x13, 0x14, 0x15,
    0x16, 0x17, 0x18, 0x19, 0x20, 0x21, 0x22, 0x23,
]);

function is_eq(arr, arr2) {
	if (arr.length != arr2.length) {
		return false;
	}

	for (let i=0; i<arr.length; i++) {
		if (arr[i] != arr2[i]) {
			return false;
		}
	}

	return true;
}

rust.then(m => {
	const pk1 = m.scalarmult(SK1);
	const pk2 = m.scalarmult(SK2);

	const ct = m.seal(SK1, pk2, NONCE, MSG);
	const pt = m.open(SK2, pk1, NONCE, ct);

	if (!is_eq(pt, MSG)) {
		console.error("wtf", pt, MSG);
	}
}).catch(console.error);
