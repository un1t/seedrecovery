"use strict"

$(() => {
	$('#id_recovery_button').click(() => {
		recover()
	});

	$('#id_generate_button').click(() => {
		$('#id_seed').val(bip39.generateMnemonic())
	})
});


function showSuccessMessage(text) {
	$('#id_messages').append(`
		<div class="w3-panel w3-green">
			<p>` + text + `</p>
		</div>`
	);
}


function showErrorMessage(text) {
	$('#id_messages').append(`
		<div class="w3-panel w3-red">
			<p>` + text + `</p>
		</div>`
	);
}

function clearMessages() {
	$('#id_messages').html('');
}

function recover() {
	clearMessages();
	clearVariants();

	var variantsWithDistance = []
	const seed = $('#id_seed').val().trim();
	if (seed == '') {
		showErrorMessage('Enter your seed.')
		return
	}

	const possibleWords = bip39.wordlists.english;
	const seedWords = seed.trim().split(/\s+/)
	for (const i in seedWords) {
		var seedWord = seedWords[i]
		for (const possibleWord of possibleWords) {
			if (possibleWord == seedWord) {
				continue
			}
			var newSeedWords = seedWords.slice()
			newSeedWords[i] = possibleWord
			var newSeed = newSeedWords.join(' ')

			var distance = jsLevenshtein(seedWord, possibleWord);
			if (distance > 2) {
				continue
			}

			var isValid = bip39.validateMnemonic(newSeed)
			if (isValid) {
				variantsWithDistance.push([distance, newSeed])
			}
		}
	}

	variantsWithDistance.sort()
	let variants = variantsWithDistance.map((x) => {
		return x[1]
	})

	if (variants.length > 0) {
		showSuccessMessage('Success! We have found some valid seeds that are similar to yours:');
		showVariants(seed, variants)
	} else {
		showErrorMessage("Can't recover your seed.");
	}
}

function showVariants(seed, variants) {
	const seedWords = seed.trim().split(/\s+/)

	for (let variant of variants) {
		let variantWords = variant.split(' ')
		for (const i in variantWords) {
			let variantWord = variantWords[i]
			let seedWord = seedWords[i]
			let diff = strDiff(seedWord, variantWord);

			var chars = variantWord.split('')
			for (let x of diff) {
				chars[x] = '<span class="w3-yellow">' +(typeof chars[x] == 'undefined' ? '&nbsp;' : chars[x]) + '</span>'
			}
			variantWords[i] = chars.join('')
		}
		showVariant(variantWords.join(' '));
	}
}

function showVariant(text) {
	$('#id_variants').append(`
		<div class="w3-panel w3-border">
			` + text + `
		</div>
	`)
}

function clearVariants() {
	$('#id_variants').html('');
}

function strDiff(s1, s2) {
	var diff = []
	const length = Math.max(s1.length, s2.length)
	for (var i = 0; i < length; i++) {
		if (s1[i] != s2[i]) {
			diff.push(i);
		}
	}
	return diff;
}
