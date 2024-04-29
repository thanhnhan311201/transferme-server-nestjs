export interface IThirdPartyConfig {
	google: {
		clientId: string;
		clientSecret: string;
		redirectUri: string;
		refreshToken: string;
	};
	github: {
		clientId: string;
		clientSecret: string;
	};
}

export const thirdPartyConfig = () => ({
	thirdParty: {
		google: {
			clientId: process.env.GOOGLE_CREDENTIAL_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CREDENTIAL_CLIENT_SECRET,
			redirectUri: process.env.GOOGLE_REDIRECT_URI,
			refreshToken: process.env.GOOGLE_CREDENTIAL_REFRESH_TOKEN,
		},
		github: {
			clientId: process.env.GITHUB_CLIENT_ID,
			clientSecret: process.env.GITHUB_CLIENT_SECRET,
		},
	},
});
