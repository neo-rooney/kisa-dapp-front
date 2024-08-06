// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;
import "@openzeppelin/contracts/token/ERC721/presets/ERC721PresetMinterPauserAutoId.sol";

contract RooneyNft is ERC721PresetMinterPauserAutoId {
    constructor() ERC721PresetMinterPauserAutoId("RooneyNft", "RNFT", "https://metadata-api-server-git-main-rooneydevs-projects.vercel.app/api/token/") {
        mint(msg.sender);
    }


    function adminBurn(uint256 tokenId) public onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_exists(tokenId), "ERC721: token does not exist");
        _burn(tokenId);
    }
}