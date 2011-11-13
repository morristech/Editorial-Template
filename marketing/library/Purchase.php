<?php
/**
 * Purchase model
 *
 * @package    Editorial
 * @subpackage Marketing
 * @copyright  Copyright (c) 2011, ThirdFrameStudios
 * @author     Miha Hribar
 */

/**
 * Purchase model
 *
 * @package     Editorial
 * @author      Miha Hribar
 * @copyright   Copyright (c) 2011, ThirdFrameStudios
 * @link        http://www.thirdframestudios.com
 * @version     1.0
 */
class Purchase
{

	/**
	 * Type PayPal
	 */
	const TYPE_PAYPAL = 0;

	/**
	 * Status started
	 */
	const STATUS_STARTED   = 0;

	/**
	 * Status confirmed
	 */
	const STATUS_CONFIRMED = 1;

	/**
	 * Status completed
	 */
	const STATUS_COMPLETED = 2;

	/**
	 * Status cancelled
	 */
	const STATUS_CANCELLED = 3;

	/**
	 * Insert.
	 *
	 * @param  array $data
	 * @return void
	 */
	public function insert(array $data)
	{
		global $wpdb;
		$wpdb->insert(
			'purchase',
			$data
		);
	}

	/**
	 * Find payment.
	 *
	 * @param  string  $ext_id
	 * @return array|null
	 */
	public function findByExtId($ext_id)
	{
		return $this->_find('ext_id', $ext_id);
	}

	/**
	 * Find purchase by hash.
	 *
	 * @param  string  $hash
	 * @return array|null
	 */
	public function findByHash($hash)
	{
		return $this->_find('hash', $hash);
	}

	/**
	 * Update a purchase.
	 *
	 * @param  integer $purchase_id
	 * @param  array   $data
	 * @return void
	 */
	public function update($purchase_id, array $data)
	{
		global $wpdb;
		// fingers crossed
		$wpdb->update(
			'purchase',
			$data,
			array(
				'purchase_id' => (int)$purchase_id,
			)
		);
	}

	/**
	 * Cancel purchase by ext_id.
	 *
	 * @param  string  $ext_id
	 * @return void
	 */
	public function cancel($ext_id)
	{
		global $wpdb;
		// fingers crosse
		$wpdb->update(
			'purchase',
			array(
				'status' => self::STATUS_CANCELLED,
			),
			array(
				'ext_id' => $wpdb->escape($ext_id),
			)
		);
	}

	/**
	 * Find row.
	 *
	 * @param  string $key
	 * @param  mixed  $value
	 */
	private function _find($key, $value)
	{
		global $wpdb;
		return $wpdb->get_row(
			sprintf(
				'SELECT * FROM `purchase` WHERE `%s` = \'%s\'',
				$key,
				$wpdb->escape($value)
			),
			ARRAY_A
		);
	}

}