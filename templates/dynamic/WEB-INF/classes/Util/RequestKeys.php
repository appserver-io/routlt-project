<?php

/**
 * ${util.namespace}\IndexAction
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Open Software License (OSL 3.0)
 * that is available through the world-wide-web at this URL:
 * http://opensource.org/licenses/osl-3.0.php
 *
 * PHP version 5
 *
 * @author  Tim Wagner <tw@appserver.io>
 * @license http://opensource.org/licenses/osl-3.0.php Open Software License (OSL 3.0)
 * @link    https://github.com/${composer.name}
 */

namespace ${util.namespace};

/**
 * Utility class containing the request keys.
 *
 * @author  Tim Wagner <tw@appserver.io>
 * @license http://opensource.org/licenses/osl-3.0.php Open Software License (OSL 3.0)
 * @link    https://github.com/${composer.name}
 */
class RequestKeys
{

    /**
     * Make constructor private to avoid direct initialization.
     */
    private function __construct()
    {
    }

    /**
     * Make clone method private to avoid initialization by cloning.
     *
     * @return ${util.namespace}\RequestKeys
     */
    private function __clone()
    {
    }

    /**
     * Rout.Lt version we're using.
     *
     * @var string
     */
    const ROUTLT_VERSION = 'routlt.version';
}
